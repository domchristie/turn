import Animations from './animations.js'
import BaseTurn from './base-turn.js'

export default class AnimationTurn extends BaseTurn {
  static supported = true

  constructor (action, options = {}) {
    super(action, options = {})
  }

  exit () {
    if (this.action === 'restore' && !this.options.animateRestore) return

    const exitAnimations = new Animations('[data-turn-exit]')

    let resolveExit
    this.animateOut = Promise.all([
      exitAnimations.ended,
      new Promise((resolve) => { resolveExit = resolve })
    ])

    this.addClasses('before-exit')
    window.requestAnimationFrame(() => {
      exitAnimations.start(() => this.addClasses('exit'))
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
      const enterAnimations = new Animations('[data-turn-enter]')
      this.animateIn = enterAnimations.ended
      enterAnimations.start(() => this.addClasses('enter'))
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
