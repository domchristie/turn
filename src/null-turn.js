export default class NullTurn {
  static supported = true
  exit () {}
  async beforeEnter () {}
  async enter () {}
  complete () {}
  abort () {}
  finished = Promise.resolve()
}
