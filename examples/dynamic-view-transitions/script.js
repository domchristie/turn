window.addEventListener('turn:before-transition', function ({ detail }) {
  let { referrer, action, initiator, newBody } = detail

  // For restoration visits, make a _reasonable_ guess at which link/form might have
  // visited the current page (`referrer`), then apply those names.
  if (action === 'restore') {
    const selector = 'a[data-transition], form[data-transition]'
    initiator = [...newBody.querySelectorAll(selector)].find(
      i => i.href === referrer || i.action === referrer
    ) || document.documentElement
  } else {
    reset()
  }

  apply(initiator)
  apply(initiator, newBody)
})

function apply (initiator, body = document.body) {
  if (!initiator.dataset.transition) return

  const viewTransitionIds = initiator.dataset.transition.split(' ')

  viewTransitionIds.forEach(function (id) {
    const element = body.querySelector(`[id='${id}']`)
    if (element) {
      element.style.viewTransitionName = element.dataset.viewTransitionName
    }
  })
}

function reset () {
  document.querySelectorAll('[data-view-transition-name]').forEach(function (e) {
    e.style.viewTransitionName = ''
  })
}
