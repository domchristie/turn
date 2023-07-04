import { motionSafe } from './helpers.js'
import Controller from './controller.js'

const Turn = {
  start () {
    if (!this.started && motionSafe()) {
      for (const event in eventListeners) {
        window.addEventListener(event, eventListeners[event])
      }
      this.controller = new Controller(Turn.config)
      this.controller.start()
      this.started = true
    }
  },

  stop () {
    if (this.started) {
      for (const event in eventListeners) {
        window.removeEventListener(event, eventListeners[event])
      }
      this.controller.stop()
      this.started = false
    }
  },

  config: {
    experimental: {
      viewTransitions: true
    }
  }
}

const eventListeners = {
  'turbo:click': function (event) {
    this.controller.click(event)
  }.bind(Turn),
  'turbo:visit': function (event) {
    this.controller.visit(event)
  }.bind(Turn),
  'turbo:submit-start': function (event) {
    this.controller.submitStart(event)
  }.bind(Turn),
  'turbo:before-render': async function (event) {
    this.controller.beforeRender(event)
  }.bind(Turn),
  'turbo:render': async function () {
    this.controller.render()
  }.bind(Turn),
  'turbo:load': async function (event) {
    this.controller.load(event)
  }.bind(Turn),
  popstate: function () {
    this.controller.popstate()
  }.bind(Turn)
}

export default Turn
