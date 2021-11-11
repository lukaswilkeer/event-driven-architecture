export const status = (socket) => {  
  const writeEvent = socket.write(true, 'utf8', (callback) => {
    console.log('writed out')
  })

  console.log('writeEvent', writeEvent)
}
  