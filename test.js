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
