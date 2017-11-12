import { expect } from 'chai'
import Pea from '..'

describe('Nest-Stream: test flow', () => {
  let ctrl1, ctrl2

  beforeEach (()=> {
    ctrl1 = new Pea([next => void next()])
    ctrl2 = new Pea([next => void next()])
    ctrl1.use(ctrl2)
  })

  it('next', done => {
    ctrl2.use(next => void next())
    ctrl1.use(() => void done()).start()
  })

  it('sub next err', done => {
    ctrl2
      .use(next => void next(new Error('err')))
      .use(next => void next())
      .use(e => void done())

    ctrl1.start()
  })

  it('sub throw err', done => {
    ctrl2
      .use(next => { throw new Error('err') })
      .use(next => void next())
      .use(err => void done())

     ctrl1.start()
  })
})

describe('Nest-Stream: test pass parameter', () => {
  let ctrl1, ctrl2

  beforeEach (()=> {
    ctrl1 = new Pea()
    ctrl2 = new Pea()
  })

  it('pass parameters from parent to sub', done => {
    ctrl1
      .use(next => void next(1))
      .use(ctrl2)

    ctrl2
      .use(a => {
        expect(a).to.equal(1)
        done()
      })

    ctrl1.start()
  })

  it('pass parameters from sub to parent', done => {
    ctrl1
      .use(next => void next())
      .use(ctrl2)

    ctrl2
      .use(next => void next(1))

    ctrl1
      .use(a => {
        expect(a).to.equal(1)
        done()
      })
      .start()
  })
})
