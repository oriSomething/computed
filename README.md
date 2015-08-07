# Computed

Ember like computed property with ES7 decorator for JavaScript classes


```js
import computed from 'computed';


class Ygritte {
  name = 'Jon Snow';

  @computed('name')
  get talk() {
    return `You know nothing ${this.name}`;
  }
}

const ygritte = new Ygritte();

ygritte.talk === 'You know nothing Jon Snow';

```


Because issues related to properties definition, to get `lastValue` you should hack it like this:

```js
class Class {
  @computed()
  get property() {
    const [lastValue] = arguments;

    ···
  }
}


```

