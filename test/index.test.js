import sinon from 'sinon'
import chai from 'chai'
import { expect } from 'chai'
import SocketClient from 'socket.io-client'
import io from '../index'
import { socketConnect } from './__mocks__/connect'
import { userToken } from './__mocks__/tokens'


describe('Connection', () => {
  it('should connect the user to the api', (done) => {
    let connections = []
    
    // get the clients connections
    Object.keys(io.engine.clients).map((key) => {
      connections[key] = io.engine.clients[key]
    })
    
    const client = socketConnect()

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

    const authorization = false
    const client = socketConnect(authorization)

    client.on('connect', (socket) => {
      expect(connections.length).to.be.eql(0)
      done()
    })

    client.on('disconnect', (done) => done())
  })
})
