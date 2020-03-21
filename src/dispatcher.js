import debug from 'debug'
import { init, last, join } from 'lodash/fp'
import InitializeServices from './initialize'

const log = debug('app')

class dispatcher extends InitializeServices {
  constructor(dir) {
    super(dir)
    this.event = ''
  }

  toUpperFirstLetter(str) {
    return str[0].toUpperCase()
  }

  getEvent(buffer) {
    return buffer?.event
  }

  dispatch(socket, buffer) {
    this.event = this.getEvent(buffer)

    if (this.event !== undefined) {
      const eventFn = last(this.event.split('.'))
      const serviceModule = join('.', init(this.event.split('.')))
      const service = this.services.get(serviceModule)
      log(`Calling: ${this.event}, ${service}`)

      if (service) {
        const moduleToInitiate = require(service)
        const moduleFn = new moduleToInitiate.default(socket, buffer)
        if (moduleFn[eventFn] !== undefined) {
          moduleFn[eventFn]()
        } else {
          const eventName = last(this.event.split('.'))
          const eventNameResponse = this.toUpperFirstLetter(eventName) + last(eventName.split('.')).substring(1)
          socket.emit('message', `${eventNameResponse} doesn't exist`)
          log(`${this.event} is undefined`)
        }
      } else {
        const eventName = last(this.event.split('.'))
        const eventNameResponse = this.toUpperFirstLetter(eventName) + last(eventName.split('.')).substring(1)
        socket.emit('message', `${eventNameResponse} doesn't exist`)
        log(`${this.event} is undefined`)
      }
    } else {
      socket.emit('message', 'Event cannot be empty')
    }
  }
}

export default dispatcher
