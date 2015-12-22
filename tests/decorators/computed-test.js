import { assert } from 'chai';
import computed from '../../lib/decorators/computed';


describe('decorators/computed', function() {
  it('should a function', function() {
    assert.isFunction(computed)
  });

  it('should return getter return value', function() {
    class C {
      @computed()
      get x() {
        return 1;
      }
    }
    const obj = new C();

    assert.strictEqual(obj.x, 1);
  });

  it('should make property enumerable to false', function() {
    class C {
      @computed()
      get x() {
        return 2;
      }
    }

    const c = new C();
    const keys = Object.keys(c);

    assert.notInclude(keys, 'x' , '`x` in not enumerable');
    assert.equal(keys.length, 0, 'keys size is 0')
  });

  it('should return another property value', function() {
    class C {
      constructor() {
        this.y = 1;
      }

      @computed()
      get x() {
        return this.y;
      }
    }
    const obj = new C();

    assert.strictEqual(obj.x, 1)
  });

  describe('cache', function() {
    it('should return cache value if no property to listen had given', function() {
      class C {
        @computed()
        get x() {
          return Date.now();
        }
      }
      const obj = new C();
      const a = obj.x;

      assert.isNumber(a);

      const b = obj.x;

      assert.isNumber(b);
      assert.strictEqual(a, b);
    });

    it('should return cache value if listened property did not changed', function() {
      class C {
        constructor() {
          this.now = Date.now();
        }

        @computed('now')
        get x() {
          return this.now * -1;
        }
      }
      const obj = new C();
      const a = obj.x;

      assert.isNumber(a);
      assert.equal(a, obj.now * -1);

      const b = obj.x;

      assert.isNumber(b);
      assert.equal(a, b);
    });

    it('should return new value if listened property changed', function() {
      class C {
        constructor() {
          this.now = Date.now();
        }

        @computed('now')
        get x() {
          return this.now * -1;
        }
      }
      const obj = new C();
      const a = obj.x;

      assert.isNumber(a);
      assert.equal(a, obj.now * -1);

      obj.now = obj.now + 1;

      const b = obj.x;

      assert.isNumber(b);
      assert.equal(b, (obj.now * -1));
    });

    it('should return new value if listened properties changed', function() {
      class C {
        constructor() {
          this.now = Date.now();
          this.nowPlusOne = this.now;
        }

        @computed('now', 'nowPlusOne')
        get x() {
          return this.now + this.nowPlusOne + 10;
        }
      }
      const obj = new C();
      const a = obj.x;
      const expectedValue = obj.now + obj.nowPlusOne + 10;

      assert.isNumber(a);
      assert.equal(a, expectedValue);

      obj.nowPlusOne += 100;

      const b = obj.x;

      assert.isNumber(b);
      assert.equal(b, expectedValue + 100);
    });
  });

  describe('parameters', function() {
    it('should receive parameter of lastValue as undefined on first time', function() {
      class C {
        @computed()
        get x() {
          assert.equal(arguments.length, 2);

          const lastValue = arguments[0];
          assert.isUndefined(lastValue);

          return 1;
        }
      }
      const obj = new C();
      const a = obj.x;

      assert.equal(a, 1);
    });

    it('should receive parameter of lastValue of cache value', function() {
      const i1 = Date.now();
      const i2 = i1 + 1;
      let counter = 0;

      class C {
        @computed('i')
        get x() {
          assert.equal(arguments.length, 2);

          counter++;
          if (counter === 2) {
            const lastValue = arguments[0];
            assert.equal(lastValue, i1);
          }

          return this.i;
        }
      }
      const obj = new C();

      obj.i = i1;
      let res = obj.x;
      assert.equal(res, i1);

      obj.i = i2;
      res = obj.x;
      assert.equal(res, i2);

      // counter works
      assert.equal(counter, 2);
    });

    it('should receive parameter of current key', function() {
      let key;

      class C {
        @computed()
        get x() {
          assert(arguments.length, 2);

          key = arguments[1];

          return 1;
        }
      }
      const obj = new C();

      assert.isUndefined(key);
      obj.x;
      assert.equal(key, 'x');
    });
  });
});
