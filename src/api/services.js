export const status = (socket) => {  
  socket.write(true, 'utf8', (callback) => {
    console.log('writed out')
  })
}
  