/**
 * Imports
 */

var Observable = require('..')
var test = require('tap').test

function noop () {}

function recordOrder () {
  var list = []
  return {
    list: list,
    record: function (name) {
      return function (val) {
        list.push({
          name: name,
          val: val
        })
      }
    }
  }
}

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
  var order = recordOrder()
  o.subscribe(order.record('A'))
  var unsubscribe = o.subscribe(function (val) {
    order.record('B')(val)
    unsubscribe()
    setImmediate(function () {
      o(2)
      t.deepEqual(order.list, [
        {name: 'A', val: 1},
        {name: 'B', val: 1},
        {name: 'C', val: 1},
        {name: 'A', val: 2},
        {name: 'C', val: 2}
      ])
    })
  })
  o.subscribe(order.record('C'))
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

test('repeated unsubscribtion should be okay', function (t) {
  var o = Observable(0)
  var unsubscribe = o.subscribe(noop)
  unsubscribe()
  unsubscribe()
  t.end()
})

test('should work after listeners were drained and readded again', function (t) {
  var o = Observable(0)
  var unsubscribe = o.subscribe(noop)
  o(1)
  unsubscribe()
  o(2)
  unsubscribe = o.subscribe(noop)
  o(3)
  t.end()
})

test('should work with 0, 1 or many listeners', function (t) {
  var o = Observable(0)
  var unsub1
  var unsub2
  var order = recordOrder()
  o(1) // zero listener
  unsub1 = o.subscribe(order.record('A'))
  o(2) // 1 listener
  unsub2 = o.subscribe(order.record('B'))
  o(3) // 2 listener
  unsub1()
  o(4) // 1 listener again
  unsub2()
  o(5) // 0 listener again
  unsub1 = o.subscribe(order.record('C'))
  o(6)
  unsub2 = o.subscribe(order.record('D'))
  o(7)
  t.deepEqual(order.list, [
    {name: 'A', val: 2},
    {name: 'A', val: 3},
    {name: 'B', val: 3},
    {name: 'B', val: 4},
    {name: 'C', val: 6},
    {name: 'C', val: 7},
    {name: 'D', val: 7}
  ])
  t.end()
})

test('it should work without subscriber', function (t) {
  var o = Observable(0)
  o(1)
  t.end()
})
