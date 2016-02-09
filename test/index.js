/**
 * Imports
 */

var Observable = require('..')
var test = require('tape')

/**
 * Tests
 */

test('should subscribe to changes', function (t) {
  t.plan(1)
  var o = new Observable()
  o.subscribe(t.pass)
  o.next(1)
})

test('should pass new value to subsribers', function (t) {
  t.plan(1)
  var o = Observable()
  o.subscribe(function (val) {
    t.equal(val, 1)
  })
  o.next(1)
})
