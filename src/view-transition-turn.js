export default class ViewTransitionTurn {
  exit () {}

  complete () {}

  async beforeEnter (event) {
    event.preventDefault()
    if (this.hasPreview) {
      await this.transition.finished
    } else {
      this.hasPreview = this.isPreview
      this.snapshot = new Promise(resolve => { this.snapshat = resolve })
      this.transition = document.startViewTransition(_ => this.render())
      await this.snapshot
    }
    event.detail.resume()
  }

  render () {
    this.snapshat()
    return new Promise(resolve => { this.rendered = resolve })
  }

  enter () {
    this.rendered()
  }

  abort () {}

  get isPreview () {
    return document.documentElement.hasAttribute('data-turbo-preview')
  }
}
