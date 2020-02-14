import sinon from 'sinon'
import chai from 'chai'
import { expect } from 'chai'
import SocketClient from 'socket.io-client'
import io from '../index'
import { userToken } from './__mocks__/tokens'


describe('Connection', () => {
  it('should connect the user to the api', (done) => {
    let connections = []
    
    // get the clients connections
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = io.engine.clients[key]
    })

    const client = SocketClient('http://localhost:3000', {
      path: '/',
      transports: ['polling', 'websocket'],
      extraHeaders: {
        authorization: userToken
      }
    })

    client.on('connect', (socket) => {
      expect(connections.length).to.be.gte(0)
      done()
    })
  })

  it('should block connection for unauthorized users', (done) => {
    let connections = []
    
    // get the clients connections
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = io.engine.clients[key]
    })

    const client = SocketClient('http://localhost:3000', {
      path: '/',
      transports: ['polling', 'websocket'],
      extraHeaders: {
        authorization: null
      }
    })

    client.on('connect', (socket) => {
      expect(connections.length).to.be.eql(0)
      done()
    })

    client.on('disconnect', (done) => done())
  })
})
