import SocketServer from 'socket.io'
import { getAuthHeader } from './src/utils.js'
import { authenticate, decode } from './src/security.js'

const io = new SocketServer(3000, {
  path: '/',
  serverClient: true,
  cookie: false
})

const closeConnection = (socket) => {
  socket.emit('message', 'user hasn`t permission')
  socket.close()
}

io.on('connection', (socket) => {
  socket.use((packet, next) => {
    return authenticate(getData(decode(getAuthHeader(socket))))
      ? next() 
      : closeConnection(socket)
  })
})

export default io
