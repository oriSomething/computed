import { expect } from 'chai';
import oneWay from '../../lib/decorators/one-way';
// import computed from '../../lib/decorators/computed';


describe('decorators/computed', function() {
  it('should a function', function() {
    expect(oneWay).to.be.a('function');
  });

  it('should make property enumerable to false', function() {
    class C {
      @oneWay('y')
      get x() {}
    }

    expect(Object.keys(new C())).to.not.include('x');
  });


  it('should throw if argument\'s length is less than one', function() {
    const f = () => {
      class C {
        @oneWay()
        get x() {}
      }
      new C();
    };

    expect(f).to.throw(Error, '@oneWay must have 1 argument only');
  });

  it('should throw if argument\'s length is bigger than one', function() {
    const f = () => {
      class C {
        @oneWay('y', 'z')
        get x() {}
      }
      new C();
    };

    expect(f).to.throw(Error, '@oneWay must have 1 argument only');
  });

  it('should return value of observed property', function() {
    class C {
      y = 2;

      @oneWay('y')
      get x() {}
    }
    const obj = new C();
    const { x } = obj;

    expect(x).to.be.equal(2);
  });

  it('should override observer property with observed property when the latter set', function() {
    class C {
      y = 2;

      @oneWay('y')
      get x() {}
    }
    const obj = new C();
    let x = obj.x;
    obj.x = 1;
    x = obj.x;

    expect(x).to.be.equal(1);
    expect(obj.y).to.be.equal(2);

    obj.y = 3;
    expect(obj.x).to.be.equal(3);
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

    expect(x).to.be.equal(1);
    expect(obj.y).to.be.equal(2);

    obj.y = 3;
    expect(obj.x).to.be.equal(3);
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

    expect(x).to.be.equal(1);
    expect(obj.y).to.be.equal(2);

    obj.y = 3;
    expect(obj.x).to.be.equal(3);
  });
});
