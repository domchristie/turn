# Turn
A starting point for animating page transitions in [Turbo Drive](https://turbo.hotwired.dev/) apps.

## Basic Usage

1. Copy `turn.js` and `turn.css` to your project and include them however you build your JavaScript & CSS
2. Add `data-turn-enter` and `data-turn-exit` to the elements you wish to animate
3. Call `Turn.start()` in your application JavaScript file
4. Navigate between pages … ✨

## Customizing Animations

Turn adds `turn-exit` and `turn-enter` classes to the HTML element at the appropriate times. Apply your own animations by scoping your animation rules with this selector. For example:

```css
html.turn-exit [data-turn-exit] {
  animation-name: MY_ANIMATE_OUT;
  animation-duration: .3s;
  animation-fill-mode: forwards;
}

html.turn-enter [data-turn-enter] {
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

This is how the `turn.css` is organized, so you may want to get rid of that file altogether. `animation-fill-mode: forwards` is recommended to prevent your transitions from jumping back.

### Custom Class Names

The values set in the `data-turn-exit` and `data-turn-enter` attributes will be applied as class names to that element. This lets you customize animations for each element. Styles should still be scoped by `html.turn-exit` and `html.turn-enter`.

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
