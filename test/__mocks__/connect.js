import socketClient from 'socket.io-client'
import { userToken } from './tokens'

<<<<<<< dev
export const socketConnect = (userToken = null) => socketClient('http://localhost:3000', {
    path: '/',
    transports: ['pooling', 'websocket'],
    extraHeaders: {
      authorization: userToken
    }
  })
=======
export const socketConnect = (userToken = null) => net.connect({
  port: 3000,
  host: 'localhost',
  authorization: userToken,
  connectListener: (socket) => {
    console.log('Connected to the server')
  }
})
>>>>>>> local

export default socketConnect
