const { Message } = require('../models');
const logger = require('../config/logger');

class MessagePersistenceWorker {
  constructor(messageQueue, options = {}) {
    this.messageQueue = messageQueue;
    this.isRunning = false;
    this.workerId = Math.random().toString(36).substring(7);

    // Configuration
    this.options = {
      intervalMs: options.intervalMs || 5000, // Process every 5 seconds
      batchSize: options.batchSize || 100, // Process up to 100 messages per interval
      maxRetries: options.maxRetries || 3,
      retryDelayMs: options.retryDelayMs || 1000,
      ...options,
    };

    // Metrics
    this.metrics = {
      totalProcessed: 0,
      totalFailed: 0,
      totalRetried: 0,
      lastProcessedAt: null,
      lastErrorAt: null,
      lastError: null,
    };

    this.intervalId = null;
  }

  /**
   * Start the background worker
   */
  start() {
    if (this.isRunning) {
      logger.warn(`[MessageWorker-${this.workerId}] Already running`);
      return;
    }

    this.isRunning = true;
    logger.info(
      `[MessageWorker-${this.workerId}] Started (interval: ${this.options.intervalMs}ms, batch: ${this.options.batchSize})`
    );

    // Run immediately on start
    this.processQueue();

    // Schedule recurring processing
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.options.intervalMs);
  }

  /**
   * Stop the background worker
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    logger.info(`[MessageWorker-${this.workerId}] Stopped`);
  }

  /**
   * Main processing loop
   * Non-blocking, all operations are async
   */
  async processQueue() {
    try {
      // Get batch from queue (synchronous, non-blocking)
      const batch = this.messageQueue.dequeueBatch(this.options.batchSize);

      if (batch.length === 0) {
        return; // Nothing to process
      }

      logger.info(
        `[MessageWorker-${this.workerId}] Processing ${batch.length} messages from queue`
      );

      // Save messages to database (async, fire-and-forget)
      await this.saveBatchToDatabase(batch);

      this.metrics.totalProcessed += batch.length;
      this.metrics.lastProcessedAt = new Date();
    } catch (error) {
      this.metrics.lastErrorAt = new Date();
      this.metrics.lastError = error.message;
      logger.error(
        `[MessageWorker-${this.workerId}] Process error:`,
        error.message
      );
    }
  }

  /**
   * Save batch of messages to database
   * Uses bulk insert for efficiency
   */
  async saveBatchToDatabase(batch, retryCount = 0) {
    try {
      // Filter out non-message events (e.g., read_receipt, typing indicators)
      const actualMessages = batch.filter(msg => !msg.type || msg.type === 'message');

      if (actualMessages.length === 0) {
        logger.debug(`[MessageWorker-${this.workerId}] No actual messages to save in batch`);
        return;
      }

      const messagesToInsert = actualMessages.map(msg => ({
        messageId: msg.messageId,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        conversationId: msg.conversationId,
        content: msg.content,
        messageType: msg.messageType || 'text',
        deliveredAt: new Date(msg.enqueuedAt), // Use queue time as delivery time
      }));

      // Bulk create using Sequelize
      await Message.bulkCreate(messagesToInsert, {
        transaction: null, // Use auto-commit
      });

      logger.info(
        `[MessageWorker-${this.workerId}] Saved ${actualMessages.length} messages to DB successfully`
      );
    } catch (error) {
      this.metrics.totalFailed++;

      if (retryCount < this.options.maxRetries) {
        this.metrics.totalRetried++;
        logger.warn(
          `[MessageWorker-${this.workerId}] Retry ${retryCount + 1}/${this.options.maxRetries}: ${error.message}`
        );

        // Wait before retry
        await this.sleep(this.options.retryDelayMs * (retryCount + 1));

        // Retry with exponential backoff
        return this.saveBatchToDatabase(batch, retryCount + 1);
      }

      // All retries failed - log and discard
      logger.error(
        `[MessageWorker-${this.workerId}] Failed to save batch after ${this.options.maxRetries} retries`,
        error.message
      );

      // Optionally: Send to dead-letter queue or alert
      this.handleFailedBatch(batch, error);
    }
  }

  /**
   * Handle messages that failed to persist
   * In production: send to dead-letter queue, alert monitoring, etc.
   */
  handleFailedBatch(batch, error) {
    logger.error(
      `[MessageWorker-${this.workerId}] Dead-letter: ${batch.length} messages lost`,
      {
        errorMessage: error.message,
        sampleMessageId: batch[0]?.conversationId,
      }
    );

    // TODO: In production, implement:
    // - Dead-letter queue to S3 or Redis
    // - Send alert to monitoring system
    // - Attempt recovery from backup
  }

  /**
   * Sleep utility for retries
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get worker metrics
   */
  getMetrics() {
    return {
      workerId: this.workerId,
      isRunning: this.isRunning,
      ...this.metrics,
      queueSize: this.messageQueue.size(),
    };
  }

  /**
   * Get detailed status
   */
  getStatus() {
    return {
      ...this.getMetrics(),
      config: this.options,
      queueMetrics: this.messageQueue.getMetrics(),
    };
  }
}

module.exports = MessagePersistenceWorker;
