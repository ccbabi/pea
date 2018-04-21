# Pea
[![Build Status](https://travis-ci.org/ccbabi/pea.svg?branch=master)](https://travis-ci.org/ccbabi/pea)

Pea is a middleware layer for web, inspired by the [connect](https://github.com/senchalabs/connect)

## Install
```sh
$ npm install pea-js
```

## Example
```javascript
import Pea from 'pea-js'

const ctrl = new Pea([function (next) {
  console.log('1')
  next()
}])
  .use(function (next) {
    console.log('2')
    // next(new Error('4'))
    // throw new Error('4')
    next()
  })
  .use(function (next) {
    console.log('3')
    next()
  })
  // error handling
  .use(function (err, next) {
    console.error(err)
  })
  .start()
```

## License
MIT
