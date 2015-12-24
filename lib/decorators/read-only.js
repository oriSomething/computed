import isFunction from '../utils/is-function';


export default function computedReadOnly(target, key, descriptor) {
  /** @validation */
  if (descriptor.set) {
    throw new TypeError(`property ${key} shouldn't have setters`);
  }
  /** @validation */
  if (!('value' in descriptor || isFunction(descriptor.get) || isFunction(descriptor.initializer))) {
    throw new TypeError(`property ${key} should have a value/getter/initializer`);
  }

  /** Do nothing for getters */
  if (descriptor.get) return;

  descriptor.writable = false;
}
