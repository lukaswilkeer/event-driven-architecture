import net from 'net'
import debug from 'debug'
import { join, init, last } from 'lodash/fp'
import { initializeServices, services, logServices } from './src/initialize'
import { getAuthHeader } from './src/utils'
import { authenticate, decode } from './src/security'
import { server } from 'sinon'

const log = debug('app')

initializeServices('api')

// fixme: the logServices function doens't work until all
// services are located, due to the fact, this causes an error
// where the services doesn't get logged
setTimeout(() => logServices(), 1000)

const toUpperFirstLetter = (str) => {
  return str[0].toUpperCase()
}

const dispatch = (socket) => (buffer) => {
  console.log(buffer.toString())
  buffer = buffer.toString()
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

const verifyAuthorization = (fn) => (socket) => {
  try {
    if (!(socket?.authorization)) {
      throw new Error('Could not found authorization token')
    } else {
      try {
        const authorization = authenticate(socket?.authorization)
        if (authorization) {
          debug('A new user into the api')
          fn(socket)
        } else {
          throw new Error('Could not found authorization token')
        }
      } catch (err) {
        debug(err)
        socket.write({ 'data': [err.error, err.message]})
      }
    }  
  } catch (err) {
    debug(err)
    socket.write({ 'data': [err.error, err.message]})
  }
}

const io = net.Server({})

io.on('data', verifyAuthorization(dispatch(io)))

io.on('error', (errorMessage) => {
  console.error(errorMessage)
  io.close()
})

io.listen(3000, () => `Listening on port 3000`)

export default io
