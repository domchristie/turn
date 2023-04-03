import NullTurn from './null-turn.js'
import AnimationTurn from './animation-turn.js'
import ViewTransitionTurn from './view-transition-turn.js'

const VIEW_TRANSITIONS = 'turn-view-transitions'
const NO_VIEW_TRANSITIONS = 'turn-no-view-transitions'
const ACTIONS = ['advance', 'restore', 'replace']

export default class Controller {
  constructor (config) {
    this.config = config
  }

  start () {
    this.animationTurn = new NullTurn()
    this.viewTransitionTurn = new NullTurn()
    addSupportClass(this.config)
  }

  stop () {
    this.animationTurn.abort()
    this.viewTransitionTurn.abort()
    this.animationTurn = new NullTurn()
    this.viewTransitionTurn = new NullTurn()
    removeSupportClasses()
  }

  visit (event) {
    this.reset(event)

    this.animationTurn = create(AnimationTurn, event.detail.action)
    if (this.config.experimental.viewTransitions) {
      this.viewTransitionTurn = create(ViewTransitionTurn, event.detail.action)
    }

    this.animationTurn.exit()
  }

  async beforeRender (event) {
    event.preventDefault()

    await this.animationTurn.beforeEnter()
    this.hasPreview
      ? await this.viewTransitionTurn.finished
      : await this.viewTransitionTurn.beforeEnter()

    if (this.isPreview) this.hasPreview = true
    event.detail.resume()
  }

  render () {
    const isInitialRender = this.isPreview || !this.hasPreview
    if (isInitialRender) {
      this._render = this.viewTransitionTurn.enter()
        .then(() => this.animationTurn.enter())
    }
  }

  async load () {
    await this._render
    this.animationTurn.complete()
    removeActionClasses()
  }

  popstate () {
    const fixNonRestoreBack = this.animationTurn.action !== 'restore'
    fixNonRestoreBack && this.animationTurn.abort()
  }

  get isPreview () {
    return document.documentElement.hasAttribute('data-turbo-preview')
  }

  reset (event) {
    removeActionClasses()
    addActionClass(event.detail.action)
    this.hasPreview = undefined
    this._render = undefined
    this.animationTurn.abort()
    this.viewTransitionTurn.abort()
  }
}

function addSupportClass (config) {
  document.documentElement.classList.add(
    ViewTransitionTurn.supported && config.experimental.viewTransitions
      ? VIEW_TRANSITIONS
      : NO_VIEW_TRANSITIONS
  )
}

function removeSupportClasses () {
  document.documentElement.classList.remove(
    ViewTransitionTurn.supported
      ? VIEW_TRANSITIONS
      : NO_VIEW_TRANSITIONS
  )
}

function addActionClass (action) {
  document.documentElement.classList.add(`turn-${action}`)
}

function removeActionClasses () {
  const classList = document.documentElement.classList
  classList.remove.apply(classList, ACTIONS.map(a => `turn-${a}`))
}

function create (Klass, action) {
  if (!Klass.supported || document.body.dataset.turn === 'false') {
    Klass = NullTurn
  }
  const options = JSON.parse(document.body.dataset.turnOptions || '{}')
  return new Klass(action, options)
}
