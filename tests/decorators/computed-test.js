import { expect } from 'chai';
import computed from '../../lib/decorators/computed';


describe('decorators/computed', function() {
  it('should a function', function() {
    expect(computed).to.be.a('function');
  });

  it('should return getter return value', function() {
    class C {
      @computed()
      get x() {
        return 1;
      }
    }
    const obj = new C();

    expect(obj.x).to.be.equal(1);
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

    expect(obj.y).to.be.equal(1);
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

      expect(a).to.be.a('number');

      const b = obj.x;

      expect(b).to.be.a('number');
      expect(a).to.equal(b);
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

      expect(a).to.be.a('number');
      expect(a).to.equal(obj.now * -1);

      const b = obj.x;

      expect(b).to.be.a('number');
      expect(b).to.equal(a);
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

      expect(a).to.be.a('number');
      expect(a).to.equal(obj.now * -1);

      obj.now = obj.now + 1;

      const b = obj.x;

      expect(b).to.be.a('number');
      expect(b).to.equal(obj.now * -1);
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

      expect(a).to.be.a('number');
      expect(a).to.equal(expectedValue);

      obj.nowPlusOne += 100;

      const b = obj.x;

      expect(b).to.be.a('number');
      expect(b).to.equal(expectedValue + 100);
    });
  });

  describe('parameters', function() {
    it('should receive parameter of lastValue as undefined on first time', function() {
      class C {
        @computed()
        get x() {
          expect(arguments.length).to.equal(2);

          const lastValue = arguments[0];
          expect(lastValue).to.be.an('undefined');

          return 1;
        }
      }
      const obj = new C();
      const a = obj.x;

      expect(a).to.equal(1);
    });

    it('should receive parameter of lastValue of cache value', function() {
      const i1 = Date.now();
      const i2 = i1 + 1;
      let counter = 0;

      class C {
        @computed('i')
        get x() {
          expect(arguments.length).to.equal(2);

          counter++;
          if (counter === 2) {
            const lastValue = arguments[0];
            expect(lastValue).to.equal(i1);
          }

          return this.i;
        }
      }
      const obj = new C();

      obj.i = i1;
      let res = obj.x;
      expect(res).to.equal(i1);

      obj.i = i2;
      res = obj.x;
      expect(res).to.equal(i2);

      // counter works
      expect(counter).to.equal(2);
    });

    it('should receive parameter of current key', function() {
      let key;

      class C {
        @computed()
        get x() {
          expect(arguments.length).to.equal(2);

          key = arguments[1];

          return 1;
        }
      }
      const obj = new C();

      expect(key).to.be.an('undefined');
      obj.x;
      expect(key).to.equal('x');
    });
  });
});
