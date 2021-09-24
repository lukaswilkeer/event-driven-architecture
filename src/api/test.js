export const board = (socket, data) => {
  socket.emit('message', data?.data)
}
