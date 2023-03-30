export default class NullTurn {
  static supported = true
  exit () {}
  beforeEnter () {}
  enter () {}
  complete () {}
  abort () {}
  finished = Promise.resolve()
}
