const rrp = require('resolve-reject-promise')

module.exports = class ReadyGuard {
  constructor() {
    const { resolve, reject, promise } = rrp()

    this.resolve = resolve
    this.reject = reject
    this.promise = promise

    this.entered = false
    this.opened = false
    this.destroyed = false
  }

  ready() {
    return this.promise
  }

  enter() {
    if (this.entered || this.destroyed) return false
    this.entered = true
    return true
  }

  exit() {
    this.opened = true
    this.resolve()
  }

  destroy(err) {
    this.destroyed = true
    if (!this.opened) this.reject(err || new Error('Ready guard destroyed'))
  }
}
