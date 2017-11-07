# Pea
Pea is a middleware layer for web, inspired by the [connect](https://github.com/senchalabs/connect)

## Example

**exmaple/demo1.js**
```javascript
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

p.start(function done () {
  console.log(arguments)
  console.log('done')
})
```

**example/demo2.js**
```javascript
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
```

## License
MIT
