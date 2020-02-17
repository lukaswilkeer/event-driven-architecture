import socketClient from 'socket.io-client'
import { userToken } from './tokens'

export const socketConnect = (token = true) => socketClient('http://localhost:3000', {
    path: '/',
    transports: ['polling', 'websocket'],
    extraHeaders: {
      authorization: token ? userToken : null
    }
  })

export default socketConnect
