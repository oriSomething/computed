import isFunction from '../utils/is-function';
import isAarryEqual from '../utils/is-array-equal';


function createGetter(properties, key, descriptor) {
  /** @constant {Function} Original getter function */
  const originalGet = descriptor.get;
  /** @type {Boolean} */
  let isFirstRun = true;
  /** @type {Array.<*>} */
  let lastPropertiesValues;
  /** @type {*} */
  let lastReturnValue;

  descriptor.get = function() {
    /** @constant {Array.<*>} */
    const currentPropertiesValues = properties.map((property) => this[property], this);

    if (isFirstRun || (!isAarryEqual(currentPropertiesValues, lastPropertiesValues))) {
      isFirstRun = false;
      /** Cache current properties */
      lastPropertiesValues = currentPropertiesValues;

      /** In Ember it's (key, value, lastValue) */
      return lastReturnValue = originalGet.call(this, lastReturnValue, key);
    }

    return lastReturnValue;
  }
}

export default function computedDecorator(...properties) {
  return function(target, key, descriptor) {
    if (isFunction(descriptor.get)) {
      createGetter(properties, key, descriptor);
    }
  };
}
