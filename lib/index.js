/**
 * Modules
 */

var isFunction = require('@f/is-function')
var slice = require('@f/slice')
var foreach = require('@f/foreach')

/**
 * Expose observable
 */

module.exports = observable

/**
 * A minimal observable
 */

function observable () {
  var listeners = []
  var nextListeners = listeners

  return {subscribe: subscribe, next: next}

  /**
   * Subscribe to updates to value
   * @param  {Function} listener
   * @return {Function} unsubscribe
   * @api public
   */

  function subscribe (listener) {
    if (!isFunction(listener)) {
      throw new Error('Expected listener to be a function.')
    }

    var isSubscribed = true
    canMutate()
    nextListeners.push(listener)

    return function unsubscribe () {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      canMutate()
      var index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  /**
   * Next value in sequence
   * @param  {Mixed}   val
   * @api public
   */

  function next (val) {
    listeners = nextListeners
    foreach(call, listeners)

    function call (listener) {
      listener(val)
    }
  }

  /**
   * Ensure than the listeners can be updated
   * @api private
   */

  function canMutate () {
    if (nextListeners === listeners) {
      nextListeners = slice(listeners)
    }
  }
}
