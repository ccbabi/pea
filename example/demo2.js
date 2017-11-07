const Pea = require('..')

var p1 = new Pea([function p1f1 (next) {
  console.log('p1-1')
  next()
}])

var p2 = new Pea([function p2f1 (next) {
  console.log('p2-1')
  next(12)
}], function p2done () {
  console.log('p2-done')

  // abort
  // return false
})

// sub pea
p1.use(p2)

p1.use(function p1f2 (n, next) {
  console.log('p1-2', n)
  next()
})

p1.start(function p1done () {
  console.log('p1-done')
})
