import { expect } from 'chai'
import io from '../index'
import { socketConnect } from './__mocks__/connect'
import { userToken } from './__mocks__/tokens'

describe('Connection', () => {
  it.only('should connect the user to the api', (done) => {
    // add user token validation
    const client = socketConnect(userToken)

    const message = Buffer.from(decodeURIComponent({event: 'api.serive.status', data: true}))

    client.write(message)
    client.on('message', (message) => {
      message = message.toString('utf8')
      expect(message).to.be.equals(true)
      done()
    })
  })

  it('should block connection for unauthorized users', (done) => {
    let connections = []
    
    // get the clients connections
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = io.engine.clients[key]
    })

    const authorization = false
    const client = socketConnect(authorization)

    expect(connections.length).to.be.eql(0)
    done()
  })

  it('should block users without permission headers', (done) => {
    const client = socketClient('http://localhost:3000', {
      path: '/',
      transports: ['pooling', 'websocket']
    })

    let connections = []
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = key
    })

    expect(connections.length).to.equals(0)
    done()
  })

  it('should call services', (done) => {
    const client = socketConnect(userToken)

    const event = { event: 'api.services.status' }

    client.emit('event', event)

    client.on('message', (data) => {
      expect(data).to.equals('online')
      done()
    })
  })

  it('should return an error message if a endpoint doesn`t exist', (done) => {
    const client = socketConnect(userToken)

    const event = {
      event: 'api.service.test.testFuncFn',
      data: 'You`re welcome'
    }

    client.emit('event', event)

    client.on('message', (data) => {
      expect(data).to.equals(`TestFuncFn doesn't exist`)
      done()
    })
  })

  it('should return an error message if a endpoint is nullish', (done) => {
    const client = socketConnect(userToken)

    const event = {
      data: 'You`re welcome'
    }

    client.emit('event', event)

    client.on('message', (data) => {
      expect(data).to.equals(`Event cannot be empty`)
      done()
    })
  })
})
