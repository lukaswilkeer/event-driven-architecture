import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { secret } from './secret'

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
      return null
    }

    return decoded
  })
}

export const authenticate = (decoded) => {
  if (typeof decoded !== 'object' || decoded?.data === null || decoded?.data === undefined) {
    return false
  }

  const date = new Date(0)
  const expires = date.setUTCSeconds(decoded?.expiresIn)
  const isExpired = expires.valueOf() > Date.now().valueOf()

  return isExpired !== false || decoded?.data?.account_type >= 0
}
