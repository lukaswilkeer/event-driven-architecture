import SocketServer from 'socket.io'
import Dispatcher from './src/dispatcher'
import debug from 'debug'
import { join, init, last } from 'lodash/fp'
import { getAuthHeader } from './src/utils'
import { authenticate, decode } from './src/security'

const log = debug('app')

const dispatcher = new Dispatcher('api')

const io = new SocketServer(3000, {
  path: '/',
  serverClient: true,
  cookie: false,
  transports: ['pooling', 'websocket'],
})

const closeConnection = (socket) => {
  socket.emit('message', 'user hasn`t permission')
  socket.disconnect()
}

io.on('connection', (socket) => {
  socket.use((packet, next) => {
    return authenticate(decode(getAuthHeader(socket))) 
      ? next()
      : closeConnection(socket)
  })
  
  socket.on('event', (buffer) => dispatcher.dispatch(socket, buffer))
})

export default io
