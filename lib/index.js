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

function observable (initialValue) {
  var listeners
  var nextListeners
  var val = initialValue

  observableValue.subscribe = subscribe
  return observableValue

  function observableValue (nextVal) {
    if (arguments.length > 0) {
      val = nextVal
      if (nextListeners !== undefined) {
        next(val)
      }
    }

    return val
  }

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
    if (nextListeners === undefined) {
      nextListeners = listener
    } else if (isFunction(nextListeners)) {
      nextListeners = [nextListeners, listener]
    } else {
      nextListeners.push(listener)
    }

    return function unsubscribe () {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      canMutate()

      if (nextListeners === listener) {
        nextListeners = undefined
      } else {
        var index = nextListeners.indexOf(listener)
        nextListeners.splice(index, 1)
        if (nextListeners.length === 1) {
          nextListeners = nextListeners[0]
        }
      }
    }
  }

  /**
   * Next value in sequence
   * @param  {Mixed}   val
   * @api public
   */

  function next (val) {
    listeners = nextListeners
    if (Array.isArray(listeners)) {
      foreach(call, listeners)
    } else {
      listeners(val)
    }

    function call (listener) {
      listener(val)
    }
  }

  /**
   * Ensure than the listeners can be updated
   * @api private
   */

  function canMutate () {
    if (nextListeners !== undefined && nextListeners === listeners && !isFunction(nextListeners)) {
      nextListeners = slice(listeners)
    }
  }
}
