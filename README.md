# Turn
Animate page transitions in [Turbo Drive](https://turbo.hotwired.dev/) apps.

## Installation
```
npm install @domchristie/turn
```

## Usage

1. Include `dist/turn.js` and `dist/turn.css` however you build your JavaScript & CSS
2. Add `data-turn-enter` and `data-turn-exit` to the elements you wish to animate (optional if you're only using View Transitions)
3. `import Turn from '@domchristie/turn'` and call `Turn.start()` in your application JavaScript
4. Navigate between pages … ✨

## View Transitions

Turn has experimental support for [View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/) and can be enabled by setting:

```js
Turn.config.experimental.viewTransitions = true
```

before calling `Turn.start()`. View Transitions are started after exit animations. Enter animations wait for View Transitions to complete before starting.

## Customizing Animations

Turn adds `turn-before-exit`, `turn-exit`, and `turn-enter` classes to the HTML element at the appropriate times. Apply your own animations by scoping your animation rules with this selector. For example:

```css
html.turn-advance.turn-exit [data-turn-exit] {
  animation-name: MY_ANIMATE_OUT;
  animation-duration: .3s;
  animation-fill-mode: forwards;
}

html.turn-advance.turn-enter [data-turn-enter] {
  animation-name: MY_ANIMATE_IN;
  animation-duration: .6s;
  animation-fill-mode: forwards;
}

@keyframes MY_ANIMATE_OUT {
  …
}

@keyframes MY_ANIMATE_IN {
  …
}
```

This is how `turn.css` is organized, so you may want to get rid of that file altogether. `animation-fill-mode: forwards` is recommended to prevent your transitions from jumping back.

### Custom Class Names

The values set in the `data-turn-exit` and `data-turn-enter` attributes will be applied as class names to that element. This lets you customize animations for each element. Styles should still be scoped by `html.turn-exit` and `html.turn-enter`.

## Class List

The following class names are added to the HTML element at various time during a navigation lifecycle.

### `turn-view-transitions`
Added on start if the device supports View Transitions, and View Transitions are enabled.

### `turn-no-view-transitions`
Added on start if the device does not support View Transitions, or View Transitions are disabled.

### `turn-advance`
Added when a visit starts and the action is `advance`. You'll probably want to scope most animations with this class. Removed when the navigation has completed and all animations have ended.

### `turn-restore`
Added when a visit starts and the action is `restore`. Given the number of ways it's possible to navigate back/forward (back button, swipe left/right, `history.back()`), it's generally recommended that restoration visits are not animated. Removed when the navigation has completed and all animations have ended.

### `turn-replace`
Added when a visit starts and the action is `replace`. Removed when the navigation has completed and all animations have ended.

### `turn-before-exit
Added when a visit starts. Useful for optimising animations with `will-change`. (See `turn.css` for an example.) Removed when the exit animations start.

### `turn-exit
Added when a visit starts. Use this to scope exit animations. Removed when the exit animations complete.

### `turn-before-transition` (if View Transitions supported & enabled)
Added after the exit animations and any request has completed, but before the View Transitions have taken their snapshot. Useful when combining View Transitions with custom exit/enter animations. To avoid a flash of content, use this class to target exited elements, and style them in their final "exit" state. (See `turn.css` for an example.) Removed when the transition starts.

### `turn-transition` (if View Transitions supported & enabled)
Adding during a View Transition. Useful when combining View Transitions with custom exit/enter animations.

### `turn-enter`
Added after any requests have completed and previous animations/transitions have completed. Removed once the aimations have completed.

### Usage with Tailwind CSS

Define animations in `tailwind.config.js`, and add a plugin that scopes the styles, e.g.:

```js
const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    extend: {
      animation: {
        exit: 'fade-out-up 0.3s cubic-bezier(0.65, 0.05, 0.35, 1) forwards',
        enter: 'fade-in-up 0.6s cubic-bezier(0.65, 0.05, 0.35, 1) forwards'
      },
      keyframes: {
        'fade-out-up': {/* … */},
        'fade-in-up': {/* … */}
      }
    }
  },

  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('turn-exit', 'html.turn-exit &')
      addVariant('turn-enter', 'html.turn-enter &')
    })
  ]
}
```

Then in your HTML:

```html
<main data-turn-exit="turn-exit:animate-exit" data-turn-enter="turn-exit:animate-enter">
  <!-- … -->
</main>
```

## Disabling Animations

Add `data-turn="false"` to the `<body>` to opt out of animations from that page.

(This currently rather basic, but is limited by the information available in Turbo events. Hopefully improvable if [`turbo:visit` events are fired on the initiating element](https://github.com/hotwired/turbo/pull/750).)

## Tip & Tricks

### 1. Animate Changes
Avoid animating the whole `body`. Animations should target elements that change on navigation. So avoid animating persistent headers and instead animate the `main` element or just the panels/cards within it.

### 2. Nesting
Nesting animating elements draws attention and brings screens to life. Add `data-turn-exit`/`data-turn-enter` attributes to elements such as headings and key images within an animating container. The compound animation effects means they'll exit faster, and enter slower than other elements. For example:
```html
<main data-turn-exit data-turn-enter>
  <h1 data-turn-exit data-turn-enter>Hello, world!</h1>
</main>
```

### 3. Optimizing Animations
Jumpy exit animations can be prevented using the `will-change` CSS property. Turn adds a `turn-before-exit` class to the HTML element just before adding the exit classes. This provides an opportunity to notify the browser of upcoming changes. For example, by default `turn.css` does the following:

```css
html.turn-before-exit [data-turn-exit],
html.turn-exit [data-turn-exit] {
  will-change: transform, opacity;
}
```

### 4. Loading Spinner
Exit animations on slow requests can leave users with a blank screen. Improve the experience with a loading spinner that appears a short time after the exit animation. For example, if your exit animation take 600ms, add a spinner that starts appearing 700ms after that by using `transition-delay`. This spinner can live permanently in the `body` and only transition when the `turn-exit` class is applied:

```css
.spinner {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 100ms;
}
html.turn-exit .spinner {
  opacity: 1;
  transition-delay: 700ms
}
```

## Not seeing animations?

Check your device preferences to see if you have requested reduced motion. Turn will only animate transitions when the `prefers-reduced-motion` media query does not match `reduce`.

## How does it work?

Turn adds exit and enter classes at the appropriate times like so:
1. on `turbo:visit` add the exit classes
2. pause `turbo:before-render` _(wait for exit animations to complete before resuming)_
3. on `turbo:render`, remove exit classes and add the enter classes
4. on `turbo:load`, wait for the enter animations to complete before removing the enter classes

## Credits

Default fade in/out animations adapted from [Jon Yablonski](https://jonyablonski.com/)'s [Humane By Design](https://humanebydesign.com/).

## License
Copyright © 2021+ Dom Christie and released under the MIT license.
