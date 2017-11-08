const Pea = require('..')

// demo1
var p = new Pea([function one (next) {
  console.log('1')
  next()
}, function two (next) {
  console.log('2')
  next()
}])

p.use(function three (next) {
  console.log('3')

  // next(new Error('custom error'))
  // throw new Error('error: 123')
  next() // eslint-disable-line no-unreachable
})

p.use(function four (err, next) {
  console.log('4')
  if (err) {
    console.error(err)
    return
  }
  // next('err1', 'err2')
  next()
})

p.start()
