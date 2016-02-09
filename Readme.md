
# observable

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Minimal observable.

## Installation

    $ npm install @f/observable

## Usage

```js
var Observable = require('@f/observable')

var o = Observable()
o.subscribe(function (next) {
  console.log(next)
}) // => 1 , 2
o.next(1)
o.next(2)

```

## API

### Observable()

**Returns:** observable

### .subscribe(listener)

- `listener` - add listener with signature `listener(nextVal)`

**Returns:** unsubscribe function

## .next(val)

- `next` - next value to send to listeners

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/observable.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/observable
[git-image]: https://img.shields.io/github/tag/micro-js/observable.svg
[git-url]: https://github.com/micro-js/observable
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/observable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/observable
