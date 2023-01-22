export default class NullTurn {
  snapshot = Promise.resolve()
  exit () {}
  beforeEnter () {}
  enter () {}
  complete () {}
  abort () {}
}
