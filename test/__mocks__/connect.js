import net from 'net'
import { userToken } from './tokens'

export const socketConnect = (userToken = null) => net.connect({
  port: 3000,
  host: 'localhost',
  authorization: userToken,
  connectListener: (socket) => {
    console.log('Connected to the server')
  }
})

const connection = socketConnect(userToken)

const message = Buffer.from(decodeURIComponent({event: 'api.services.status', data: true}))

const write = connection.write('data', 'utf8', () => {
  console.log('writed to the server')
})

connection.on('data', console.log)
console.log('write', write)

export default socketConnect
