'use strict'
const Lab = require('Lab')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = require('code').expect

const infoLevel = {level: 'info', test: 'works'}
const debugLevel = {level: 'debug', test: 'works'}
const warnLevel = {level: 'warn', test: 'works'}
const errorLevel = {level: 'error', test: 'works'}
const fatalLevel = {level: 'fatal', test: 'works'}

const LogFilter = require('../seneca-log-filter')

describe('log levels', () => {
  it('gets the log level from the "level" property', (done) => {
    let filter = LogFilter({level: 'info'})

    expect(filter(infoLevel)).to.equal(infoLevel)
    expect(filter(debugLevel)).to.be.null
    expect(filter(warnLevel)).to.be.null
    done()
  })

  it('handles aliases', (done) => {
    let filter = LogFilter({
      level: 'unicorn',
      aliases: {
        'unicorn': {
          handled: true,
          handler: function () { return ['info'] }
        }
      }
    })
    expect(filter(debugLevel)).to.be.null
    expect(filter(infoLevel)).to.equal(infoLevel)
    expect(filter(warnLevel)).to.be.null
    done()
  })

  it('Does not handle aliases when "handled" flag is false', (done) => {
    let filter = LogFilter({
      level: 'unicorn',
      aliases: {
        'unicorn': {
          handled: false,
          handler: function () { return ['info'] }
        }
      }
    })
    expect(filter(infoLevel)).to.be.null
    done()
  })

  it('logs on info+ when no level or alias specified', (done) => {
    let filter = LogFilter({})
    expect(filter(infoLevel)).to.equal(infoLevel)
    expect(filter(debugLevel)).to.be.null
    expect(filter(warnLevel)).to.equal(warnLevel)
    done()
  })

  it('only logs in the expected levels using "+"', (done) => {
    let filter = LogFilter({level: 'warn+'})
    expect(filter(debugLevel)).to.be.null
    expect(filter(infoLevel)).to.be.null
    expect(filter(warnLevel)).to.equal(warnLevel)
    expect(filter(errorLevel)).to.equal(errorLevel)
    expect(filter(fatalLevel)).to.equal(fatalLevel)
    done()
  })
})
