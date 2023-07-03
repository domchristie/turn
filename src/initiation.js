export default class Initiation {
  constructor () {
    this.reset()
  }

  static startWithClick (event) {
    return new this().startWithClick(event)
  }

  static startWithSubmit (event) {
    return new this().startWithSubmit(event)
  }

  static startWithHistory (event) {
    return new this().startWithHistory(event)
  }

  startWithClick (event) {
    this.initiator = event.target
    this.#once('turbo:before-visit', this.#beforeVisit)
    return this
  }

  startWithSubmit (event) {
    if (event.target.tagName === 'FORM') {
      this.initiator = event.target
      this.#once('turbo:submit-start', this.#submitStart)
    }
    return this
  }

  startWithHistory () {
    this.initiator = document.documentElement
    return this
  }

  reset () {
    this.initiator = document.documentElement
  }

  #beforeVisit = (event) => {
    if (event.defaultPrevented) this.reset()
  }

  #submitStart = (event) => {
    if (this.#submissionStopped(event.detail?.formSubmission)) this.reset()
  }

  #submissionStopped (submission) {
    return submission?.state === 5
  }

  #once (name, handler) {
    window.removeEventListener(name, handler)
    window.addEventListener(name, handler, { once: true })
  }
}
