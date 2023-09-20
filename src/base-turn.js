import { camelCase, pascalCase } from './helpers.js'

const DEFAULT_OPTIONS = {
  animateRestore: false
}

export default class BaseTurn {
  constructor (action, direction = 'none', options = {}) {
    this.action = action
    this.direction = direction
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.beforeExitClasses = new Set()
    this.exitClasses = new Set()
    this.enterClasses = new Set()
    this.beforeTransitionClasses = new Set()
    this.transitionClasses = new Set()
    this.forwardClasses = new Set()
    this.backClasses = new Set()
    this.noneClasses = new Set()
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

  dispatch (eventName, { target = document, detail = {}, bubbles = true, cancelable = true } = {}) {
    const type = `turn:${eventName}`
    const event = new window.CustomEvent(type, { detail, bubbles, cancelable })
    target.dispatchEvent(event)
    return event
  }
}
