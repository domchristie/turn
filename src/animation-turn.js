import { animationsEnd } from './helpers.js'
import BaseTurn from './base-turn.js'

export default class AnimationTurn extends BaseTurn {
  static supported = true

  constructor (action, options = {}) {
    super(action, options = {})
  }

  exit () {
    if (this.action === 'restore' && !this.options.animateRestore) return

    let resolveExit
    this.animateOut = Promise.all([
      animationsEnd('[data-turn-exit]'),
      new Promise((resolve) => { resolveExit = resolve })
    ])

    this.addClasses('before-exit')
    window.requestAnimationFrame(() => {
      this.addClasses('exit')
      this.removeClasses('before-exit')
      resolveExit()
    })
  }

  async beforeEnter () {
    if (this.action !== 'restore' || this.options.animateRestore) {
      await this.animateOut
      this.removeClasses('exit')
      await this.animateIn // only present on post-preview enters
    }
  }

  enter () {
    if (this.action !== 'restore' || this.options.animateRestore) {
      this.animateIn = animationsEnd('[data-turn-enter]')
      this.addClasses('enter')
    }
  }

  async complete () {
    await this.animateIn
    this.removeClasses('enter')
  }

  abort () {
    this.removeClasses('before-exit')
    this.removeClasses('exit')
    this.removeClasses('enter')
  }
}
