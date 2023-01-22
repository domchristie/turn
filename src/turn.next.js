import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { motionSafe } from './helpers.js'
import NullTurn from './null-turn.js'
import ViewTransitionTurn from './view-transition-turn.js'

let currentTurn = new NullTurn()

export function useTurn () {
  if (!motionSafe()) return

  const router = useRouter()

  useEffect(() => {
    currentTurn.snapshot
      .then(() => currentTurn.enter())
      .then(() => currentTurn.complete())

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
