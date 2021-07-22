# Turn
A starting point for animating page transitions in Turbo apps.
**Note**: this is experimental and currently requires Turbo v7.0.0-rc.1.

## Basic Usage

1. Copy `turn.js` and `turn.css` to your project and include them however you build your JavaScript & CSS
2. Add `data-turn-enter` and `data-turn-exit` to the elements you wish to animate
3. Call `Turn.start()` in your application JavaScript file
4. Navigate between pages … ✨

## Customizing Animations
There are two ways to customize animations:

### 1. Scope CSS by `html.turn-exit` / `html.turn-enter`
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

This is how the `turn.css` is organized, so you may want to get rid of that altogether. `animation-fill-mode: forwards` is recommended to prevent your transitions from jumping back.

### 2. Define animation classes as `data-turn-exit` & `data-turn-enter` values
The values set in the `data-turn-exit` and `data-turn-enter` attributes will be applied as class names to that element. For example, if you're using [Animate.css](https://animate.style/), you might do:

```html
<main
  data-turn-exit="animated animate__fadeOutUp"
  data-turn-enter="animated animate__fadeInUp">
  …
</main>
```

## How does it work?

Turn adds exit and enter classes at the appropriate times like so:
1. on `turbo:visit` add the exit classes
2. pause `turbo:before-render` _(wait for exit animations to complete before resuming)_
3. on `turbo:render`, remove exit classes and add the enter classes
4. on 'turbo:load', wait for the enter animations to complete before removing the enter classes

## License
Copyright © 2021+ Dom Christie and released under the MIT license.
