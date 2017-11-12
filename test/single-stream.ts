import { expect } from 'chai'
import Pea from '..'

describe('Single-Stream: test flow', () => {
  let ctrl

  beforeEach (()=> {
    ctrl = new Pea([next => void next()])
  })

  it('next', done => {
    ctrl
      .use(() => void done())
      .start()
  })

  it('next err', done => {
    ctrl
      .use(next => void next(new Error('err')))
      .use(next => void next())
      .use(e => void done())
      .start()
  })

  it('throw err', done => {
    ctrl
      .use(next => { throw new Error('err') })
      .use(next => void next())
      .use(err => void done())
      .start()
  })
})

describe('Single-Stream: test pass parameter', () => {
  let ctrl
  beforeEach (()=> {
    ctrl = new Pea()
  })

  it('start pass a parameter', done => {
    ctrl.use(a => {
      expect(a).to.not.ok
      done()
    })
    .start(false)
  })

  it('start pass multiple parameter', done => {
    ctrl
      .use((a, b) => {
        expect(a).to.not.ok
        expect(b).to.ok
        done()
      })
      .start(false, true)
  })

  it('next pass a parameter', done => {
    ctrl
      .use(next => void next(1))
      .use(a => {
        expect(a).to.equal(1)
        done()
      })
      .start()
  })

  it('next pass multiple parameter', done => {
    ctrl
      .use(next => void next(1, 2))
      .use((a, b) => {
        expect(a).to.equal(1)
        expect(b).to.equal(2)
        done()
      })
      .start()
  })

  it('first parameter is null or undefined', done => {
    ctrl.use(a => {
      expect(a).to.ok
      done()
    })
    .start(null, true)
  })
})
