export default class SharedElementTransitionTurn {
  constructor () {
    this.transition = document.createDocumentTransition()
  }

  exit () {}

  complete () {}

  async beforeEnter (event) {
    event.preventDefault()
    if (this.hasPreview) {
      await this.transitioned
    } else {
      this.hasPreview = this.isPreview
      this.snapshot = new Promise(resolve => { this.snapshat = resolve })
      this.transitioned = this.transition.start(_ => this.render())
      await this.snapshot
    }
    event.detail.resume()
  }

  enter () {
    this.rendered()
  }

  abort () {
    this.transition.abandon()
  }

  get isPreview () {
    return document.documentElement.hasAttribute('data-turbo-preview')
  }

  render () {
    this.snapshat()
    return new Promise(resolve => { this.rendered = resolve })
  }
}
