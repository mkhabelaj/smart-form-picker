/**
 * Creates a signal with an initial value
 * @param {any} initialValue
 * @returns {{get: function, set: function}}
 */
function signal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  function get() {
    if (currentEffect) {
      subscribers.add(currentEffect);
    }
    return value;
  }

  function set(val) {
    value = val;
    for (const effect of subscribers) {
      effect();
    }
  }

  return { get, set };
}

let currentEffect = null;

/**
 * Creates an effect
 * @param {function} fn
 */
function createEffect(fn) {
  currentEffect = fn;
  fn();
  currentEffect = null;
}

/**
 * Checks if a value is a signal
 * @param {*} value
 * @returns {boolean}
 */
function isSignal(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.get === "function" &&
    typeof value.set === "function"
  );
}

export { signal, createEffect, isSignal };
