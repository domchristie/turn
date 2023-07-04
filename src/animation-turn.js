import Animations from './animations.js'
import BaseTurn from './base-turn.js'

export default class AnimationTurn extends BaseTurn {
  static supported = true

  exit (detail) {
    const exitAnimations = new Animations('[data-turn-exit]')

    let resolveExit
    this.animateOut = Promise.all([
      exitAnimations.ended,
      new Promise((resolve) => { resolveExit = resolve })
    ])

    this.addClasses('before-exit')
    this.dispatch('before-exit', { detail })

    window.requestAnimationFrame(() => {
      exitAnimations.start(() => this.addClasses('exit'))
      this.removeClasses('before-exit')
      resolveExit()
    })
  }

  async beforeEnter (detail) {
    await this.animateOut
    this.removeClasses('exit')
    if (this.animateIn) await this.animateIn // only present on post-preview enters
    else {
      this.dispatch('before-enter', {
        detail: { ...detail, action: this.action }
      })
    }
  }

  enter () {
    const enterAnimations = new Animations('[data-turn-enter]')
    this.animateIn = enterAnimations.ended
    enterAnimations.start(() => this.addClasses('enter'))
    return this.animateIn
  }

  async complete (detail) {
    this.removeClasses('enter')
    this.dispatch('enter', { detail: { ...detail, action: this.action } })
  }

  abort () {
    this.removeClasses('before-exit')
    this.removeClasses('exit')
    this.removeClasses('enter')
  }

  get finished () {
    return this.animateIn
  }
}
