import { useEffect } from 'react'
import { useRouter } from 'next/router.js'
import { motionSafe } from '../../src/helpers.js'
import NullTurn from '../../src/null-turn.js'
import ViewTransitionTurn from '../../src/view-transition-turn.js'

let currentTurn = new NullTurn()

export function useTurn () {
  if (!motionSafe()) return

  const router = useRouter()

  useEffect(() => {
    currentTurn.snapshot
      .then(() => currentTurn.enter())

    router.events.on('routeChangeStart', visit)
    router.events.on('beforeHistoryChange', beforeRender)
    return () => {
      router.events.off('routeChangeStart', visit)
      router.events.off('beforeHistoryChange', beforeRender)
    }
  }, [router])

  return () => {
    currentTurn = new NullTurn()
  }

  function visit () {
    currentTurn.abort()
    currentTurn = new (document.startViewTransition
      ? ViewTransitionTurn
      : NullTurn
    )()
    currentTurn.exit()
  }

  function beforeRender () {
    currentTurn.beforeEnter()
  }
}
