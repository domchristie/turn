export function prefersReducedMotion () {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    return !mediaQuery || mediaQuery.matches
  } else {
    return true
  }
}

export function motionSafe () {
  return !prefersReducedMotion()
}

export function animationsEnd (selector) {
  const elements = [...document.querySelectorAll(selector)]

  return Promise.all(elements.map((element) => {
    return new Promise((resolve) => {
      function listener () {
        element.removeEventListener('animationend', listener)
        resolve()
      }
      element.addEventListener('animationend', listener)
    })
  }))
}

export function pascalCase (string) {
  return string.split(/[^\w]/).map(capitalize).join('')
}

export function camelCase (string) {
  return string.split(/[^\w]/).map(
    (w, i) => i === 0 ? w.toLowerCase() : capitalize(w)
  ).join('')
}

function capitalize (string) {
  return string.replace(/^\w/, (c) => c.toUpperCase())
}
