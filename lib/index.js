/**
 * Modules
 */

var isFunction = require('@f/is-function')
var slice = require('@f/slice')
var foreach = require('@f/foreach')

/**
 * Expose observable
 */

module.exports = Observable

/**
 * A minimal observable
 */

function Observable () {
  if (! (this instanceof Observable)) {
    return new Observable()
  }

  this.listeners = []
  this.nextListeners = this.listeners
}

/**
 * Subscribe to updates to value
 * @param  {Function} listener
 * @return {Function} unsubscribe
 * @api public
 */

Observable.prototype.subscribe = function (listener) {
  if (!isFunction(listener)) {
    throw new Error('Expected listener to be a function.')
  }

  var self = this
  var isSubscribed = true
  self.canMutate()
  self.nextListeners.push(listener)

  return function unsubscribe () {
    if (!isSubscribed) {
      return
    }

    isSubscribed = false

    self.canMutate()
    var index = self.nextListeners.indexOf(listener)
    self.nextListeners.splice(index, 1)
  }
}

/**
 * Next value in sequence
 * @param  {Mixed}   val
 * @api public
 */

Observable.prototype.next = function (val) {
  this.listeners = this.nextListeners
  foreach(call, this.listeners)

  function call (listener) {
    listener(val)
  }
}

/**
 * Ensure than the listeners can be updated
 * @api private
 */

Observable.prototype.canMutate = function () {
  if (this.nextListeners === this.listeners) {
    this.nextListeners = slice(this.listeners)
  }
}
