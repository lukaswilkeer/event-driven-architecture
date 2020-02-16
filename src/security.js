import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { secret } from './secret.js'

export const passwordHash = (password) => {
  return crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex')
}

export const encode = (data) => {
  if (data == null) {
    return null
  } else {
    return jwt.sign({data:data, expiresIn: 60*60*24}, secret)
  }
}

export const decode = (token) => {
  return jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error(err)
      return null
    }

    return decoded
  })
}

export const authenticate = (decoded) => {
  const date = new Date(0)
  const expires = date.setUTCSeconds(decoded?.expiresIn)
  const isExpired = expires.valueOf() > Date.now().valueOf()

  return isExpired || decoded?.data?.account_type > 0
}
