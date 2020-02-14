import { encode } from '../../src/security'

export const user = {
  account_type: 1,
  email: 'turbofan@proton.com',
  password: 'manity',
  name: 'Lukw',
  last_name: 'wilkerson',
  _id: '5ddd9c08d64cec7cd249bdde'
}

export const userToken = encode({
  account_type: 1,
  email: 'turbofan@proton.com',
  password: 'manity',
  name: 'Lukw',
  last_name: 'wilkerson',
  _id: '5ddd9c08d64cec7cd249bdde'
})
