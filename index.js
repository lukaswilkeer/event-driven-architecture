import SocketServer from 'socket.io'
import debug from 'debug'
import { join, init, last } from 'lodash/fp'
import { initializeServices, services, logServices } from './src/initialize'
import { getAuthHeader } from './src/utils'
import { authenticate, decode } from './src/security'

const log = debug('app')

initializeServices('api')

// fixme: the logServices function doens't work until all
// services are located, due to the fact, this causes an error
// where the services doesn't get logged
setTimeout(() => logServices(), 1000)

const toUpperFirstLetter = (str) => {
  return str[0].toUpperCase()
}

const dispatcher = (socket) => (buffer) => {
    const event = buffer?.event
    const data = buffer?.data
   
   if (event !== undefined) {
    const eventFn = last(event.split('.'))
    const serviceModule = join('.', init(event.split('.')))
    const service = services.get(serviceModule)
    log(`Calling: ${event}, ${service}`)

    if (service) {
      const module = require(service)
      if (module[eventFn] !== undefined) {
        module[eventFn](socket, buffer)
      } else {
        const eventName = last(event.split('.'))
        const eventNameResponse = toUpperFirstLetter(eventName) + last(eventName.split('.')).substring(1)
        socket.emit('message', `${eventNameResponse} doesn't exist`)
      }

    } else {
      log(event)
      const eventName = last(event.split('.'))
      const eventNameResponse = toUpperFirstLetter(eventName) + last(eventName.split('.')).substring(1)
      socket.emit('message', `${eventNameResponse} doesn't exist`)
    }
  } else {
    socket.emit('message', `Event cannot be empty`)
  }
}

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
  
  socket.on('event', dispatcher(socket))
})

export default io
