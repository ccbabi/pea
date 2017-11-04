const Pea = require('..')

var p1 = new Pea([function one (next) {
  console.log('p1')
  next()
}])

var p2 = new Pea([function one1 (next) {
  console.log('p2-1')
  next(12)
}])

// 控制2
p1.use(p2)

p1.use(function two (n, next) {
  console.log('p1-2', n)
  next()
})

p1.start(function () {
  console.log('done')
})
