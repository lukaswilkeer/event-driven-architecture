export const status = (socket, data = null) => {  
  socket.emit("message", "online");
};
  