import { animationsEnd, camelCase, pascalCase } from './helpers.js'

const DEFAULT_OPTIONS = {
  animateRestore: false
}

export default class AnimationTurn {
  constructor (action, options = {}) {
    this.action = action
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.beforeExitClasses = new Set()
    this.exitClasses = new Set()
    this.enterClasses = new Set()
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
    if (this.action === 'restore' && !this.options.animateRestore) return

    if (this.isPreview) {
      this.hasPreview = true
      await this.animateOut
    } else {
      await this.animateOut
      if (this.animateIn) await this.animateIn
    }
  }

  async enter () {
    this.removeClasses('exit')

    if (this.shouldAnimateEnter) {
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

  get shouldAnimateEnter () {
    if (this.action === 'restore' && !this.options.animateRestore) return false
    if (this.isPreview) return true
    if (this.hasPreview) return false
    return true
  }

  get isPreview () {
    return document.documentElement.hasAttribute('data-turbo-preview')
  }

  addClasses (type) {
    document.documentElement.classList.add(`turn-${type}`)

    Array.from(document.querySelectorAll(`[data-turn-${type}]`)).forEach((element) => {
      element.dataset[`turn${pascalCase(type)}`].split(/\s+/).forEach((klass) => {
        if (klass) {
          element.classList.add(klass)
          this[`${camelCase(type)}Classes`].add(klass)
        }
      })
    })
  }

  removeClasses (type) {
    document.documentElement.classList.remove(`turn-${type}`)

    Array.from(document.querySelectorAll(`[data-turn-${type}]`)).forEach((element) => {
      this[`${camelCase(type)}Classes`].forEach((klass) => element.classList.remove(klass))
    })
  }
}
