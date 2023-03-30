import { motionSafe } from './helpers.js'
import NullTurn from './null-turn.js'
import AnimationTurn from './animation-turn.js'
import ViewTransitionTurn from './view-transition-turn.js'

const supportedClassName = ViewTransitionTurn.supported ? 'turn-view-transitions' : 'turn-no-view-transitions'

const Turn = {
  start () {
    if (!this.started && motionSafe()) {
      for (const event in eventListeners) {
        window.addEventListener(event, eventListeners[event])
      }
      document.documentElement.classList.add(supportedClassName)
      this.started = true
    }
  },

  stop () {
    if (this.started) {
      for (const event in eventListeners) {
        window.removeEventListener(event, eventListeners[event])
      }
      this.animationTurn = new NullTurn()
      this.viewTransitionTurn = new NullTurn()
      document.documentElement.classList.remove(supportedClassName)
      this.started = false
    }
  },

  animationTurn: new NullTurn(),
  viewTransitionTurn: new NullTurn(),

  get isPreview () {
    return document.documentElement.hasAttribute('data-turbo-preview')
  },

  config: {
    experimental: {
      viewTransitions: false
    }
  }
}

const eventListeners = {
  'turbo:visit': function (event) {
    document.documentElement.classList.remove('turn-advance', 'turn-restore')
    this.hasPreview = undefined
    this.animationTurn.abort()
    this.animationTurn = create(AnimationTurn, event.detail.action)
    if (Turn.config.experimental.viewTransitions) {
      this.viewTransitionTurn = create(ViewTransitionTurn, event.detail.action)
    }

    document.documentElement.classList.add(`turn-${event.detail.action}`)
    this.animationTurn.exit()
  }.bind(Turn),
  'turbo:before-render': async function (event) {
    event.preventDefault()

    await this.animationTurn.beforeEnter()
    this.hasPreview
      ? await this.viewTransitionTurn.finished
      : await this.viewTransitionTurn.beforeEnter()

    if (this.isPreview) this.hasPreview = true
    event.detail.resume()
  }.bind(Turn),
  'turbo:render': async function () {
    const isInitialRender = this.isPreview || !this.hasPreview
    if (isInitialRender) {
      this.enter = this.viewTransitionTurn.enter()
      await this.enter
      this.animationTurn.enter()
    }
  }.bind(Turn),
  'turbo:load': async function () {
    await this.enter
    this.animationTurn.complete()
    document.documentElement.classList.remove('turn-advance', 'turn-restore')
  }.bind(Turn),
  popstate: function () {
    const fixNonRestoreBack = this.animationTurn.action !== 'restore'
    fixNonRestoreBack && this.animationTurn.abort()
  }.bind(Turn)
}

function create (Klass, action) {
  if (!Klass.supported || document.body.dataset.turn === 'false' || action === 'replace') {
    Klass = NullTurn
  }
  const options = JSON.parse(document.body.dataset.turnOptions || '{}')
  return new Klass(action, options)
}

export default Turn
