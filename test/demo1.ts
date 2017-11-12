import Pea from '..'

const ctrl = new Pea([next => {
  console.log('1')
  next()
}, next => {
  console.log('2')
  next()
}])

ctrl.use(function (next) {
  console.log('3')

  // next(new Error('custom error'))
  // throw new Error('error: 123')
  next() // eslint-disable-line no-unreachable
})

ctrl.use(function four (err, next) {
  console.error(err)
  next()
})

ctrl.start()
