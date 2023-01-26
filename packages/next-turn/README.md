# next-turn
Animate Next.js page transitions with the View Transitions API.

## Usage

```
npm i --save @domchristie/next-turn
```

Import and wrap your HTML in the the `Turn` component, for example in `pages/_app.js`:

```js
import Turn from '@domchristie/next-turn'

export default function App ({ Component, pageProps }) {
  return (
    <Turn>
      <nav>
        <Link href="/" >Home</Link>
        <Link href="/about" >About</Link>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </Turn>
  )
}

```
