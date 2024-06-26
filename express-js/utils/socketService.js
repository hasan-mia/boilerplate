const { getIO } = require("../config/socket");

const sendMessage = (channel, event, data) => {
  const io = getIO();
  io.emit(channel, { event, message: data });
};

module.exports = { sendMessage };