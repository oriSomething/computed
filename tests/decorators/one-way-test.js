import { assert } from 'chai';
import oneWay from '../../lib/decorators/one-way';
// import computed from '../../lib/decorators/computed';


describe('decorators/oneWay', function() {
  it('should a function', function() {
    assert.isFunction(oneWay)
  });

  it('should make property enumerable to false', function() {
    class C {
      @oneWay('y')
      get x() {}
    }

    const c = new C();
    const cKeys = Object.keys(c);

    assert.notInclude(cKeys, 'x');
  });

  it('should throw if argument\'s length is less than one', function() {
    const f = () => {
      class C {
        @oneWay()
        get x() {}
      }
      new C();
    };

    assert.throw(f, Error, '@oneWay must have 1 argument only');
  });

  it('should throw if argument\'s length is bigger than one', function() {
    const f = () => {
      class C {
        @oneWay('y', 'z')
        get x() {}
      }
      new C();
    };

    assert.throws(f, Error, '@oneWay must have 1 argument only');
  });

  it('should return value of observed property', function() {
    class C {
      constructor() {
        this.y = 2;
      }

      @oneWay('y')
      get x() {}
    }
    const obj = new C();
    const { x } = obj;

    assert.equal(x, 2);
  });

  it('should override observer property with observed property when the latter set', function() {
    class C {
      constructor() {
        this.y = 2;
      }

      @oneWay('y')
      get x() {}
    }
    const obj = new C();
    let x = obj.x;
    obj.x = 1;
    x = obj.x;

    assert.equal(x, 1);
    assert.equal(obj.y, 2);

    obj.y = 3;
    assert.equal(obj.x, 3);
  });

  it('should override observer property with observed property when the latter set when @oneWay decorate a function', function() {
    class C {
      y = 2;

      @oneWay('y')
      x() {}
    }
    const obj = new C();
    let x = obj.x;
    obj.x = 1;
    x = obj.x;

    assert.equal(x, 1);
    assert.equal(obj.y, 2);

    obj.y = 3;
    assert.equal(obj.x, 3);
  });

  it('should have correct event when listen to getter/setter property', function() {
    class C {
      y = 2;

      @oneWay('y')
      get x() {}
    }
    const obj = new C();
    obj.x = 1;
    let x = obj.x;

    assert.equal(x, 1);
    assert.equal(obj.y, 2);

    obj.y = 3;
    assert.equal(obj.x, 3);
  });
});
