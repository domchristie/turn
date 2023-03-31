
import { animationsEnd } from './helpers.js'

export default class Animations {
  constructor (selector) {
    this.selector = selector
    this.elements = [...document.querySelectorAll(selector)]
    this.ended = new Promise((resolve) => { this.resolve = resolve })
  }

  async start (applyAnimations) {
    applyAnimations()

    if (this.elements.every((e) => e.getAnimations().length)) {
      await animationsEnd(this.selector)
      this.resolve()
    } else {
      this.resolve()
    }
  }
}
