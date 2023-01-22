# next-turn
Animate Next.js page transitions with the View Transitions API.

## Usage

```
npm i --save @domchristie/next-turn
```

Import and call `useTurn` in your component, for example in `pages/_app.js`:

```js
import { useTurn } from '@domchristie/next-turn'

export default function App ({ Component, pageProps }) {
  useTurn()

  return (
    <>
      <nav>
        <Link href="/" >Home</Link>
        <Link href="/about" >About</Link>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

```
