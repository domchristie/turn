import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/turn.next.js',
  output: [
    {
      file: 'dist/turn.next.js'
    },
    {
      file: 'dist/turn.next.min.js',
      plugins: [terser()]
    }
  ],
  external: ['react', 'next/router']
}
