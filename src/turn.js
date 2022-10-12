import { motionSafe } from './helpers.js'
import NullTurn from './null-turn.js'
import AnimationTurn from './animation-turn.js'

const Turn = {
  start () {
    if (!this.started && motionSafe()) {
      for (const event in eventListeners) {
        window.addEventListener(event, eventListeners[event])
      }
      this.started = true
    }
  },

  stop () {
    if (this.started) {
      for (const event in eventListeners) {
        window.removeEventListener(event, eventListeners[event])
      }
      this.currentTurn = new NullTurn()
      this.started = false
    }
  },

  currentTurn: new NullTurn()
}

const eventListeners = {
  'turbo:visit': function (event) {
    this.currentTurn.abort()
    this.currentTurn = create(event.detail.action)
    this.currentTurn.exit()
  }.bind(Turn),
  'turbo:before-render': function (event) {
    this.currentTurn.beforeEnter(event)
  }.bind(Turn),
  'turbo:render': function () {
    this.currentTurn.enter()
  }.bind(Turn),
  'turbo:load': function () {
    this.currentTurn.complete()
  }.bind(Turn),
  popstate: function () {
    const fixNonRestoreBack = (
      this.currentTurn.action !== 'restore' &&
      this.currentTurn instanceof AnimationTurn
    )
    fixNonRestoreBack && this.currentTurn.abort()
  }.bind(Turn)
}

function create (action) {
  const Klass = document.body.dataset.turn === 'false' || action === 'replace'
    ? NullTurn
    : AnimationTurn
  const options = JSON.parse(document.body.dataset.turnOptions || '{}')
  return new Klass(action, options)
}

export default Turn
