const Pea = require('..')
var p2 = new Pea()
var p1 = new Pea()

p1.use(function (next) {
  console.log('p1-1')
  next()
})

// use sub pea
p1.use(p2)
p2.use(function p2f1 (next) {
  console.log('p2-1')
  throw Error('xx')
  // next()
})

p1.use(function (next) {
  console.log('p1-2')
  next()
})

p1.use(function (e, next) {
  console.log(e)
  console.log('p1 finaly err')
})

p1.start()
