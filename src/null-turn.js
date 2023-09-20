export default class NullTurn {
  static supported = true
  direction = 'none'
  exit () {}
  async beforeEnter () {}
  async enter () {}
  complete () {}
  abort () {}
  finished = Promise.resolve()
}
