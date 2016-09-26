/**
 * Imports
 */

var Observable = require('..')
var test = require('tap').test

/**
 * Tests
 */

test('should subscribe to changes', function (t) {
  t.plan(1)
  var o = new Observable()
  o.subscribe(t.pass)
  o(1)
})

test('should pass new value to subscribers', function (t) {
  t.plan(2)
  var o = Observable(0)

  t.equal(o(), 0)
  o.subscribe(function (val) {
    t.equal(val, 1)
  })
  o(1)
})

test('should allow to unsubscribe while listening', function (t) {
  t.plan(1)
  var o = Observable(0)
  var order = []
  var record = function (name) {
    return function (val) {
      order.push({
        name: name,
        val: val
      })
    }
  }
  o.subscribe(record('A'))
  var unsubscribe = o.subscribe(function (val) {
    record('B')(val)
    unsubscribe()
    setImmediate(function () {
      o(2)
      t.deepEqual(order, [
        {name: 'A', val: 1},
        {name: 'B', val: 1},
        {name: 'C', val: 1},
        {name: 'A', val: 2},
        {name: 'C', val: 2}
      ])
    })
  })
  o.subscribe(record('C'))
  o(1)
})

test('should throw an exception if something else but a function is added as listener', function (t) {
  var o = Observable(0)
  try {
    o.subscribe('a')
  } catch (e) {
    t.end()
    return
  }
  t.fail('Error expected when subscribing with string')
})
