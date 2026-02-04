/**
 * In-Memory Message Queue
 * Stores messages temporarily before persistence
 * Zero-latency queue for real-time delivery
 */

class MessageQueue {
  constructor(maxSize = 10000) {
    this.queue = [];
    this.maxSize = maxSize;
    this.metrics = {
      enqueued: 0,
      dequeued: 0,
      failed: 0,
    };
  }

  /**
   * Add message to queue (non-blocking)
   * @param {Object} message - Message object
   * @returns {boolean} - Success status
   */
  enqueue(message) {
    try {
      if (this.queue.length >= this.maxSize) {
        this.metrics.failed++;
        console.warn(`[MessageQueue] Queue full (${this.maxSize}), dropping message`);
        return false;
      }

      this.queue.push({
        ...message,
        enqueuedAt: Date.now(),
      });

      this.metrics.enqueued++;
      return true;
    } catch (error) {
      this.metrics.failed++;
      console.error('[MessageQueue] Enqueue error:', error.message);
      return false;
    }
  }

  /**
   * Get and remove all messages from queue (batch operation)
   * @param {number} batchSize - Maximum messages to return
   * @returns {Array} - Array of messages
   */
  dequeueBatch(batchSize = 100) {
    try {
      const batch = this.queue.splice(0, Math.min(batchSize, this.queue.length));
      this.metrics.dequeued += batch.length;
      return batch;
    } catch (error) {
      console.error('[MessageQueue] Dequeue error:', error.message);
      return [];
    }
  }

  /**
   * Get current queue size
   * @returns {number}
   */
  size() {
    return this.queue.length;
  }

  /**
   * Get queue metrics
   * @returns {Object} - Metrics object
   */
  getMetrics() {
    return {
      ...this.metrics,
      currentSize: this.queue.length,
      maxSize: this.maxSize,
    };
  }

  /**
   * Clear queue (for emergency/testing)
   */
  clear() {
    const clearedCount = this.queue.length;
    this.queue = [];
    return clearedCount;
  }

  /**
   * Peek at messages without removing (for monitoring)
   * @param {number} limit
   * @returns {Array}
   */
  peek(limit = 10) {
    return this.queue.slice(0, limit);
  }
}

module.exports = MessageQueue;
