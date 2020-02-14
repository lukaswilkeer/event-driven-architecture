import sinon from 'sinon'
import chai from 'chai'
import { expect } from 'chai'
import { getAuthHeader, getData } from '../src/utils'
import { decode } from '../src/security'
import { userToken } from './__mocks__/tokens'

describe('Utilites functions', () => {
    describe('get the auth header', () => {
        it('should get the auth header', (done) => {
            const socketConnectionMock = { handshake: { headers: { authorization: 'usertoken' }}}

            expect(getAuthHeader(socketConnectionMock)).to.equals('usertoken')
            done()
        })

        it('should return undefined if doesn`t have the propertly headers', (done) => {
            const socketConnectionMock = { handshake: { headers: {}}}

            expect(getAuthHeader(socketConnectionMock)).to.equals(undefined)
            done()
        })
    })

    describe('get the token decoded data', () => {
        it('should get the decoded data', (done) => {
            const decoded = decode(userToken)

            expect(getData(decoded)).to.be.an('object')
            done()
        })

        it('should return undefined if doens`t have token decoded data', (done) => {
            const decoded = {}
            expect(getData(decoded)).to.equals(undefined)
            done()
        })
    })
})
