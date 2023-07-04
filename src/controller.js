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
    this.currentUrl = window.location.toString()
  }

  stop () {
    this.animationTurn.abort()
    this.viewTransitionTurn.abort()
    this.animationTurn = new NullTurn()
    this.viewTransitionTurn = new NullTurn()
    removeSupportClasses()
    delete this.initiator
    delete this.currentUrl
  }

  click (event) {
    this.initiator = event.target
  }

  submitStart (event) {
    this.initiator = event.target
  }

  visit (event) {
    this.reset(event)

    this.animationTurn = create(AnimationTurn, event.detail.action)
    this.viewTransitionTurn = create(ViewTransitionTurn, event.detail.action)

    this.animationTurn.exit({
      ...event.detail,
      referrer: this.currentUrl,
      initiator: this.initiator
    })
  }

  async beforeRender (event) {
    event.preventDefault()

    const detail = {
      newBody: event.detail.newBody,
      referrer: this.currentUrl,
      initiator: this.initiator
    }
    await this.animationTurn.beforeEnter(detail)

    this.hasPreview
      ? await this.viewTransitionTurn.finished
      : await this.viewTransitionTurn.beforeEnter(detail)

    if (this.isPreview) this.hasPreview = true
    event.detail.resume()
  }

  render () {
    this.currentUrl = window.location.toString()
    delete this.initiator

    const isInitialRender = this.isPreview || !this.hasPreview
    if (isInitialRender) {
      this._render = this.viewTransitionTurn.enter()
        .then(() => this.animationTurn.enter())
    }
  }

  async load (event) {
    await this._render
    removeActionClasses()
    this.animationTurn.complete({
      ...event.detail,
      referrer: this.currentUrl
    })
  }

  popstate (event) {
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
    if (event.detail.action === 'restore' || !this.initiator) {
      this.initiator = document.documentElement
    }
  }
}

function addSupportClass () {
  document.documentElement.classList.add(
    ViewTransitionTurn.supported ? VIEW_TRANSITIONS : NO_VIEW_TRANSITIONS
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
