# Computed

Ember like computed property with ES7 decorator for JavaScript classes


```js
import computed from 'computed';


class Ygritte {
  name = 'Jon Snow';

  @computed('name', function() {
    return `You know nothing ${this.name}`;
  }) talk
}

const ygritte = new Ygritte();

ygritte.talk === 'You know nothing Jon Snow';

```


If you want the getter last value returned by the getter you have a `lastValue` param in `get`:

```js
class Class {
  @computed({
    get(lastValue) {
      ···
    }    
  }) property
}


```
