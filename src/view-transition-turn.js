import BaseTurn from './base-turn.js'

export default class ViewTransitionTurn extends BaseTurn {
  static supported = !!document.startViewTransition

  prepare () {
    this.snapshot = new Promise(resolve => { this.snapshat = resolve })
    this.transition = document.startViewTransition(_ => this.render())
    return this.snapshot
  }

  exit () {}

  async beforeEnter (detail) {
    this.addClasses('before-transition')
    this.dispatch('before-transition', {
      detail: { ...detail, action: this.action }
    })
    await this.prepare()
  }

  render () {
    this.snapshat()
    return new Promise(resolve => { this.rendered = resolve })
  }

  async enter () {
    this.rendered()
    this.removeClasses('before-transition')
    this.addClasses('transition')
    await this.finished
    await Promise.resolve() // next tick
    this.removeClasses('transition')
  }

  complete () {}

  abort () {
    this.removeClasses('transition')
  }

  rendered () {}

  get finished () {
    return this.transition?.finished
  }
}
