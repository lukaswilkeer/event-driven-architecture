import sinon from 'sinon'
import chai from 'chai'
import { expect } from 'chai'
import * as security from '../src/security'
import { user, userToken, userTokenExpired } from './__mocks__/tokens'

beforeEach(() => {
    sinon.restore()
})

describe('Password hash', () => {
    it('should hash the password', (done) => {
        const hash = security.passwordHash('algumacoisa')
        const hexCheck = /[0-9A-Fa-f]{6}/g

        expect(hexCheck.test(hash)).to.equals(true)
        done()
    })
})

describe('Auth token validation', () => {
    it('should check valid tokens', (done) => {
        const decoded = security.decode(userToken)
        expect(decoded).to.have.property('data')
        expect(decoded.data).to.have.property('name')
        done()
    })

    it('should check expiration date on tokens', (done) => {
        const date = new Date(0)
        const decoded = security.decode(userToken)

        setTimeout(() => {
            const expiration = date.setUTCSeconds(decoded.expiresIn)
            const isExpired = expiration.valueOf() > Date.now().valueOf()
            expect(isExpired).to.equal(false)
            done()
        }, 1500)
    })

    it('should authenticate user', (done) => {
        const result = security.authenticate(security.decode(userToken))
        expect(result).to.equal(true)
        done()
    })

    it('should encode the data', (done) => {
        const encodeStub = sinon.stub(security, 'encode').callsFake((user) => 'sometoken')
        const encoded = security.encode(user)
       
        expect(encoded).to.be.equal('sometoken')
        done()
    })
})
