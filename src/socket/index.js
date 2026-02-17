const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: { origin: '*' } // restrict in production
    });
    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return next(new Error('User not found'));
        socket.userId = user._id.toString();
        socket.userRole = user.role;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.userId, 'role:', socket.userRole);
      socket.join(`user:${socket.userId}`);
      if (socket.userRole === 'doctor') {
        socket.join('doctors');
      }
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
      });
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
  }
};