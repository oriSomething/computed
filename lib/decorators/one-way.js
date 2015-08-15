import assign from 'object-assign';
import isFunction from '../utils/is-function';


function descriptorForGetter(property, key, descriptor) {
  /** @type {*} Key's value or property value */
  let value;
  /**
   * Was value set by `property` or `key`
   * - true For value override for the observer property (`key`)
   * - false For value from the observed property (`property`)
   * @type {Boolean}
   */
  let valueOverrided = false;


  /**
   * Descriptor's getter exclude first time
   * @return {*} The value that was set by key or by property
   */
  const get = function() {
    return valueOverrided ? value : this[property];
  };

  /**
   * Descriptor's setter
   * @param {*} overridedValue The value to be set
   */
  const set = function(overridedValue) {
    value = overridedValue;
    valueOverrided = true;
  };

  /** `enumerable = true` because it's property */
  descriptor.enumerable = true;
  /** @type {Function} Setter */
  descriptor.set = set;
  /** @type {Function} Getter (once) */
  descriptor.get = function() {
    /** @type {*} Property's value */
    let propertyValue = this[property];
    /** @type {Object} Descriptor of `property` */
    const propertyDescriptorOfPrototype = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), property);


    /**
     * `property`'s new descriptor
     */
    if (propertyDescriptorOfPrototype && isFunction(propertyDescriptorOfPrototype.get)) {
      /** Only if mutable, needs to observer */
      if (isFunction(propertyDescriptorOfPrototype.set)) {
        /** @type {Function} Setter of original property */
        const originalPropertySetter = propertyDescriptorOfPrototype.set;

        Object.defineProperty(this, property, assign({}, propertyDescriptorOfPrototype, {
          set(newValue) {
            valueOverrided = false;
            propertyValue = newValue;
            originalPropertySetter.apply(this, newValue);
          }
        }));
      }

    /** Else if it's just a value */
    } else {
      Object.defineProperty(this, property, {
        enumerable: true,
        configurable: true,
        get() {
          return propertyValue;
        },
        set(newValue) {
          valueOverrided = false;
          propertyValue = newValue;
        }
      });
    }


    /**
     * `key`'s new descriptor
     */
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: get,
      set: set
    });


    return get.apply(this);
  };
}


export default function oneWayDecorator(property) {
  if (arguments.length !== 1) {
    throw new Error('@oneWay must have 1 argument only');
  }

  return function(target, key, descriptor) {
    if (isFunction(descriptor.get)) {
      descriptorForGetter(property, key, descriptor);

    } else if (isFunction(descriptor.value)) {
      delete descriptor.value;
      delete descriptor.writable;
      descriptorForGetter(property, key, descriptor)
    } else {

      throw new Error('no function getter')
    }
  };
}
