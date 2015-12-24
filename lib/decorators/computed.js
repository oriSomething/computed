import isFunction from '../utils/is-function';
import isAarryEqual from '../utils/is-array-equal';


// TODO: if no getter
// TODO: setter
function createComputedDecorator(properties, key, descriptor, functions) {
  if (isFunction(functions.set)) {
    descriptor.set = functions.set;
  }

  /** @constant {Function} Original getter function */
  const originalGet = functions.get;
  /** @type {Boolean} */
  let isFirstRun = true;
  /** @type {Array.<*>} */
  let lastPropertiesValues;
  /** @type {*} */
  let lastReturnValue;


  /** initializer needs to be removed */
  delete descriptor.initializer;
  /** `enumerable = false` because it's a computed property */
  descriptor.enumerable = false;
  /** Enabling reassign descriptor */
  descriptor.configurable = true;

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

export default function computedDecorator(...args) {
  const functions = args[args.length - 1];
  const properties = args.slice(0, args.length - 1);

  return function(target, key, descriptor) {
    if (isFunction(functions)) {
      createComputedDecorator(properties, key, descriptor, {
        get: functions
      });
    } else {
      createComputedDecorator(properties, key, descriptor, {
        get: functions.get,
        set: functions.set
      });
    }
  };
}
