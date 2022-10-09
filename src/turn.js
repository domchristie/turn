import { motionSafe } from './helpers.js'
import NullTurn from './null-turn.js'
import AnimationTurn from './animation-turn.js'

const Turn = {
  start () {
    if (!this.started && motionSafe()) {
      for (var event in this.eventListeners) {
        addEventListener(event, this.eventListeners[event])
      }
      this.started = true
    }
  },

  stop () {
    if (this.started) {
      for (var event in this.eventListeners) {
        removeEventListener(event, this.eventListeners[event])
      }
      this.currentTurn = new NullTurn
      this.started = false
    }
  },

  create (event) {
    const Klass = document.body.dataset.turn === 'false'
      ? NullTurn
      : AnimationTurn
    return new Klass(event.detail.action)
  },

  currentTurn: new NullTurn
}

Turn.eventListeners = {
  'turbo:visit': function (event) {
    this.currentTurn.abort()
    this.currentTurn = this.create(event)
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
  'popstate': function () {
    const fixNonRestoreBack = (
      this.currentTurn.action !== 'restore' &&
      this.currentTurn instanceof AnimationTurn
    )
    fixNonRestoreBack && this.currentTurn.abort()
  }.bind(Turn)
}

export default Turn
