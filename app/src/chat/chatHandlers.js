const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

/**
 * Register all chat event handlers
 * @param {Server} io - Socket.IO server instance
 * @param {MessageQueue} messageQueue - Message queue instance
 */
function registerChatHandlers(io, messageQueue) {
  io.on('connection', socket => {
    const userId = socket.handshake.query.userId;
    const userRole = socket.handshake.query.userRole; // 'STUDENT' or 'TEACHER'

    logger.info(
      `[Socket] User ${userId} (${userRole}) connected. Socket ID: ${socket.id}`
    );

    /**
     * Event: User joins a chat room
     * Room format: "chat_${senderId}_${receiverId}" (always sorted for consistency)
     */
    socket.on('join_room', data => {
      const { conversationId } = data;

      if (!conversationId) {
        socket.emit('error', { message: 'conversationId is required' });
        return;
      }

      socket.join(conversationId);
      logger.debug(`[Socket] User ${userId} joined room: ${conversationId}`);

      // Notify other users in room that user is online (non-blocking)
      socket.to(conversationId).emit('user_online', {
        userId,
        userRole,
        timestamp: new Date(),
      });
    });

    /**
     * Event: User sends a message
     * CRITICAL: This handler MUST NOT await database operations
     * Message is emitted immediately, then queued for async persistence
     */
    socket.on('send_message', data => {
      const { conversationId, receiverId, content, messageType = 'text' } = data;

      // Validate input (lightweight, synchronous)
      if (!conversationId || !receiverId || !content) {
        socket.emit('error', {
          message: 'Missing required fields: conversationId, receiverId, content',
        });
        return;
      }

      // Generate unique messageId using UUID
      const messageId = uuidv4();

      // Create message object
      const message = {
        messageId,
        senderId: userId,
        receiverId,
        conversationId,
        content,
        messageType,
        timestamp: Date.now(),
        socketId: socket.id,
      };

      // PHASE 1: Emit message immediately (zero latency)
      const response = {
        ...message,
        deliveredAt: new Date(),
        status: 'delivered',
      };

      // Send delivered confirmation
      socket.emit('message_delivered', response);

      // Send message to receiver in the conversation room
      socket.to(conversationId).emit('receive_message', response);

      logger.info(
        `[Socket] Message ${messageId} delivered from ${userId} to ${receiverId} in room ${conversationId}`
      );

      // PHASE 2: Queue for persistence (fire-and-forget, non-blocking)
      const enqueued = messageQueue.enqueue(message);

      if (!enqueued) {
        logger.warn(
          `[Socket] Failed to queue message from ${userId} (queue may be full)`
        );
      }
    });

    /**
     * Event: User leaves a chat room
     */
    socket.on('leave_room', data => {
      const { conversationId } = data;

      if (conversationId) {
        socket.leave(conversationId);
        logger.debug(`[Socket] User ${userId} left room: ${conversationId}`);

        socket.to(conversationId).emit('user_offline', {
          userId,
          timestamp: new Date(),
        });
      }
    });

    /**
     * Event: User is typing (lightweight, real-time indicator)
     */
    socket.on('user_typing', data => {
      const { conversationId } = data;

      socket.to(conversationId).emit('user_typing', {
        userId,
        timestamp: new Date(),
      });
    });

    /**
     * Event: User stopped typing
     */
    socket.on('user_stopped_typing', data => {
      const { conversationId } = data;

      socket.to(conversationId).emit('user_stopped_typing', {
        userId,
        timestamp: new Date(),
      });
    });

    /**
     * Event: Mark message as read
     * Queue for async persistence
     */
    socket.on('mark_as_read', data => {
      const { messageId, conversationId } = data;

    //   socket.emit('message_read_ack', { messageId });
      socket.to(conversationId).emit('message_seen', {
        messageId,
        readBy: userId,
        timestamp: new Date(),
      });

      // Queue for persistence (non-blocking)
      messageQueue.enqueue({
        type: 'read_receipt',
        messageId,
        userId,
        timestamp: Date.now(),
      });
    });

    /**
     * Event: Disconnect
     */
    socket.on('disconnect', reason => {
      logger.info(
        `[Socket] User ${userId} disconnected. Reason: ${reason}`
      );
    });

    /**
     * Event: Error handling
     */
    socket.on('error', error => {
      logger.error(`[Socket] Error for user ${userId}:`, error);
    });
  });
}

/**
 * Helper: Generate conversation ID from two user IDs (consistent ordering)
 * @param {number} userId1
 * @param {number} userId2
 * @returns {string}
 */
function getConversationId(userId1, userId2) {
  const sorted = [userId1, userId2].sort((a, b) => a - b);
  return `chat_${sorted[0]}_${sorted[1]}`;
}

module.exports = {
  registerChatHandlers,
  getConversationId,
};
