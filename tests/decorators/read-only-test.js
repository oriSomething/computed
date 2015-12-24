import { assert } from 'chai';
import computed from '../../lib/decorators/computed';
import readOnly from '../../lib/decorators/read-only';

describe('decorators/readOnly', function() {
  it('should a function', function() {
    assert.isFunction(readOnly)
  });

  it('should work for functions', function() {
    class Obj {
      @readOnly
      x() {
        return 1;
      }
    }

    const descriptor = Object.getOwnPropertyDescriptor(Obj.prototype, 'x');
    assert.isFalse(descriptor.writable);
  });

  it('should do nothing for getters', function() {
    class Obj {
      @readOnly
      get x() {
        return 1;
      }
    }

    const descriptor = Object.getOwnPropertyDescriptor(Obj.prototype, 'x');
    assert.notOk(descriptor.writable);
  });

  it('should work for initializers', function() {
    class Obj {
      @readOnly x = 1
    }

    const o = new Obj;
    const descriptor = Object.getOwnPropertyDescriptor(o, 'x');
    assert.isFalse(descriptor.writable);
    assert.strictEqual(o.x, 1);
  });

  describe('errors', function() {
    it('should throw for setters', function() {
      const fn = () => (
        class Obj {
          @readOnly
          set x(value) {
            return value;
          }
        }
      );

      assert.throws(fn, TypeError);
    });

    it('should throw for empty value', function() {
      const fn = () => (
        class Obj {
          @readOnly x
        }
      );

      assert.throws(fn, TypeError);
    });
  });

  describe('mix with computed decorators', function() {
    it('getter computed', function() {
      class Obj {
        @readOnly
        @computed(function() {
          return 10;
        }) x
      }

      // Can't check with Object.getOwnPropertyDescriptor now, might be because
      // intializers aren't in the standard cuurently
      const o = new Obj();
      assert.strictEqual(o.x, 10, 'test value');
      assert.throws(() => o.x = 4, TypeError);
    });

    it('setter & getter computed', function() {
      const fn = () => (
        class Obj {
          @readOnly
          @computed({
            get() {
              return 10;
            },

            set(value) {
              return value;
            }
          }) x
        }
      );

      assert.throws(fn, TypeError);
    });
  })
});
