const http = require('http');
const socketIO = require('socket.io');

const connectSocket = (app) => {
  const server = http.createServer(app);
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected', socket);

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return server;
};

module.exports = connectSocket;
