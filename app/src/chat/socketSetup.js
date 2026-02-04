const socketIO = require('socket.io');
const logger = require('../config/logger');
const { registerChatHandlers } = require('./chatHandlers');
const MessageQueue = require('./messageQueue');
const MessagePersistenceWorker = require('./backgroundWorker');

let io = null;
let messageQueue = null;
let persistenceWorker = null;

/**
 * Initialize Socket.IO server
 * @param {Server} httpServer - Express HTTP server instance
 * @param {Object} options - Configuration options
 * @returns {Object} - { io, messageQueue, persistenceWorker }
 */
function initializeSocketIO(httpServer, options = {}) {
  if (io) {
    logger.warn('[SocketIO] Already initialized');
    return { io, messageQueue, persistenceWorker };
  }

  // Create Socket.IO instance
  io = new socketIO.Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 1e6, // 1MB max message size
    pingInterval: 25000,
    pingTimeout: 20000,
    upgradeTimeout: 10000,
  });

  logger.info('[SocketIO] Initialized with WebSocket transport');

  // Initialize message queue
  messageQueue = new MessageQueue(options.queueMaxSize || 10000);
  logger.info('[MessageQueue] Initialized');

  // Initialize persistence worker
  persistenceWorker = new MessagePersistenceWorker(messageQueue, {
    intervalMs: options.workerIntervalMs || 5000,
    batchSize: options.workerBatchSize || 100,
    maxRetries: options.workerMaxRetries || 3,
  });

  // Start persistence worker
  persistenceWorker.start();
  logger.info('[MessageWorker] Started');

  // Register chat event handlers
  registerChatHandlers(io, messageQueue);
  logger.info('[ChatHandlers] Registered');

  // Middleware: Authentication (optional but recommended)
  io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    const userRole = socket.handshake.query.userRole;

    if (!userId || !userRole) {
      return next(new Error('Authentication error: userId and userRole required'));
    }

    // Optional: Validate token, check permissions, etc.
    socket.userId = userId;
    socket.userRole = userRole;

    next();
  });

  // Handle errors
  io.on('error', error => {
    logger.error('[SocketIO] Server error:', error.message);
  });

  return { io, messageQueue, persistenceWorker };
}

/**
 * Get Socket.IO instance (for route handlers, etc.)
 * @returns {Server|null}
 */
function getIO() {
  return io;
}

/**
 * Get message queue instance
 * @returns {MessageQueue|null}
 */
function getMessageQueue() {
  return messageQueue;
}

/**
 * Get persistence worker instance
 * @returns {MessagePersistenceWorker|null}
 */
function getPersistenceWorker() {
  return persistenceWorker;
}

/**
 * Graceful shutdown
 */
function shutdownSocketIO() {
  return new Promise((resolve, reject) => {
    try {
      if (persistenceWorker && persistenceWorker.isRunning) {
        persistenceWorker.stop();
        logger.info('[MessageWorker] Stopped');
      }

      if (io) {
        io.close();
        logger.info('[SocketIO] Closed');
      }

      resolve();
    } catch (error) {
      logger.error('[SocketIO] Shutdown error:', error.message);
      reject(error);
    }
  });
}

/**
 * Get system status and metrics
 * @returns {Object}
 */
function getSystemStatus() {
  return {
    socketIO: {
      connected: io ? io.engine.clientsCount : 0,
      rooms: io ? Object.keys(io.sockets.adapter.rooms || {}).length : 0,
    },
    queue: messageQueue ? messageQueue.getMetrics() : null,
    worker: persistenceWorker ? persistenceWorker.getMetrics() : null,
  };
}

module.exports = {
  initializeSocketIO,
  getIO,
  getMessageQueue,
  getPersistenceWorker,
  shutdownSocketIO,
  getSystemStatus,
};
