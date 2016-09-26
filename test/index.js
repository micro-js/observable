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
