# ready-guard

Like a composite ReadyResource

```
npm install ready-guard
```

`¯\\_(ツ)_/¯`

## Usage

```js
const ReadyGuard = require('ready-guard')

class CountOnce {
  constructor() {
    this.value = 0
    this.counting = new ReadyGuard()
    this.count()
  }

  count() {
    if (!this.counting.enter()) return this.counting.ready()

    // Simulate doing something asynchronous
    setTimeout(() => {
      this.value++
      this.counting.exit()
    }, 100)
    return this.counting.ready()
  }
}

const counter = new CountOnce()
await Promise.all([counter.count(), counter.count()])

console.log(counter.value) // 1
```

#### `const guard = new ReadyGuard()`

Create a ready guard instance.

#### `await guard.ready()`

A promise representing the scope for the guard has been exited at least once.

#### `const bool = guard.enter()`

Called to note that the guarded process was entered or initiated. Useful for debouncing calls for readying something once:

```js
async function scope() {
  if (!this.guard.enter()) return this.guard.ready()
  // Do stuff...
  this.guard.exit()
}
```

#### `guard.exit()`

Mark leaving the scope that was guarded. Resolves the `ready()` promise when called.

#### `guard.destroy()`

Cancels the scope, marks the guard as destroyed and rejects the ready promise.

#### `guard.entered`

Whether the scope was entered via `guard.enter()`.

#### `guard.opened`

Whether the scope completed via `guard.exit()` at least once.

#### `guard.destroyed`

Whether the guard was destroyed via `guard.destroy()`.

## License

Apache-2.0
