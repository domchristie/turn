import { Component } from 'react'
import { withRouter } from 'next/router.js'
import NullTurn from '../../src/null-turn.js'
import AnimationTurn from './animation-turn.js'
import ViewTransitionTurn from '../../src/view-transition-turn.js'

let currentTurn = new NullTurn()

class Turn extends Component {
  componentDidMount () {
    this.props.router.events.on('routeChangeStart', this.#start)
  }

  #start = () => {
    currentTurn.abort()
    currentTurn = create('advance')
    currentTurn.exit()
  }

  shouldComponentUpdate () {
    currentTurn.beforeEnter()
      .then(() => this.forceUpdate())
    return false
  }

  render () {
    return this.props.children
  }

  componentDidUpdate () {
    currentTurn.enter()
    currentTurn.complete()
  }

  componentWillUnmount () {
    currentTurn = new NullTurn()
    this.props.router.events.off('routeChangeStart', this.#start)
  }
}

function create (action) {
  const Klass = useViewTransition() ? ViewTransitionTurn : AnimationTurn
  return new Klass(action)
}

function useViewTransition () {
  return !!document.startViewTransition
}

export default withRouter(Turn)
