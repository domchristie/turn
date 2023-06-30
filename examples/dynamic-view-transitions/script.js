window.addEventListener('turn:before-transition', function ({ detail }) {
  const { sourceUrl, action, initiator, newBody } = detail

  if (action === 'restore') {
    [...newBody.querySelectorAll('a[data-transition]')].forEach(function (a) {
      if (a.href === sourceUrl) {
        apply(a, newBody)
        apply(a)
      }
    })
  } else if (initiator.dataset?.transition) {
    reset()
    apply(initiator, newBody)
    apply(initiator)
  }
})

function apply (transitioner, body = document.body) {
  const viewTransitionIds = transitioner.dataset.transition.split(' ')

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
