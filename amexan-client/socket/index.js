const socketIO = require('socket.io');

let io;
module.exports = {
  init: (server) => {
    io = socketIO(server, {
      cors: { origin: '*' } // restrict in production
    });
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error('Authentication error'));
        socket.userId = user.id;
        next();
      });
    });
    io.on('connection', (socket) => {
      console.log('User connected:', socket.userId);
      socket.join(`user:${socket.userId}`); // room for user
      socket.join(`role:${socket.userRole}`); // room for all doctors, etc.
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
  }
};