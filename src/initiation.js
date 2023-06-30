export default class Initiation {
  constructor () {
    this.reset()
  }

  startWithClick (event) {
    this.initiator = event.target
    this.sourceUrl = event.detail.url
    window.removeEventListener('turbo:before-visit', this.#beforeVisit)
    window.addEventListener('turbo:before-visit', this.#beforeVisit, {
      once: true
    })
  }

  startWithSubmit (event) {
    if (event.target.tagName === 'FORM') {
      this.initiator = event.target
      this.sourceUrl = window.location.toString()

      window.removeEventListener('turbo:submit-start', this.#submitStart)
      window.addEventListener('turbo:submit-start', this.#submitStart, {
        once: true
      })
    }
  }

  reset () {
    this.initiator = document.documentElement
    delete this.sourceUrl
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
}
