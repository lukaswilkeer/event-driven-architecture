export const testFunc = (socket, data) => {
  socket.emit('message', data?.data)
}
