import Pea from '..'

const ctrl1 = new Pea()
const ctrl2 = new Pea([next => {
  console.log('c2-1')
  next()
}])

ctrl1.use(function (next) {
  console.log('c1-1')
  next()
})

// use sub pea
ctrl1.use(ctrl2)
ctrl2.use(function (next) {
  console.log('c2-2')
  // throw Error('xx')
  next()
})

ctrl1.use(function (next) {
  console.log('c1-2')
  next()
})

ctrl1.use(function (e, next) {
  console.log(e)
  console.log('c1 finaly err')
})

ctrl1.start()
