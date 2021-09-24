import sinon from 'sinon'
import chai from 'chai'
import { expect } from 'chai'
import socketConnect from '../__mocks__/connect'
import { userToken } from '../__mocks__/tokens'
import '../../index'

describe('Demonstrate module system', () => {
  it('should respond with a greeting', (done) => {
    const client = socketConnect(userToken)

    const data = {
      event: 'api.hello.greeting',
      name: 'a name'
    }

    client.emit('event', data)
    client.on('message', (message) => {
      expect(message).to.equals(`You're welcome ${data.name}`)
      done()
    })
  })
})
