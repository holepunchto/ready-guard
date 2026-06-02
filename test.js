const test = require('brittle')
const ReadyGuard = require('./')

test('basic', async function (t) {
  const b = new ReadyGuard()
  let i = 0

  ready()
  ready()
  await ready()

  t.is(i, 1)

  async function ready() {
    if (!b.enter()) return b.ready()
    await 1
    i++
    b.exit()
  }
})

test('readme - example', async (t) => {
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

  t.is(counter.value, 1, 'ran once')
})

test('opened - can be set true after destroy()', (t) => {
  const b = new ReadyGuard()

  t.absent(b.opened, 'initially not opened')
  t.ok(b.enter(), 'first enter & before destroy returns true')
  t.execution(b.destroy(), 'destroy() doesnt throw itself')
  t.execution(b.exit(), 'exit() doesnt throw')
  t.ok(b.opened, 'flagged as opened')
  t.ok(b.destroyed, 'flagged as destroyed')

  t.execution(b.exit(), 'exit() can be called again')

  // Intentionally placed last to 1) catch the error 2) show that opened is set before checking ready
  t.exception(() => b.ready(), 'Ready guard destroyed', 'throws after destroying')
})

test('destroy', (t) => {
  const b = new ReadyGuard()

  t.absent(b.destroyed, 'destroyed flag initially not set')
  t.ok(b.enter(), 'first enter & before destroy returns true')
  t.execution(b.destroy(), 'destroy() doesnt throw itself')
  t.exception(() => b.ready(), 'Ready guard destroyed', 'throws after destroying')
  t.ok(b.destroyed, 'sets flag as destroyed')

  const b2 = new ReadyGuard()

  b2.destroy()
  t.exception(() => b2.ready(), 'Ready guard destroyed', 'throws after destroying again')
  t.absent(b2.enter(), 'enter() after destroy() returns false')
})
