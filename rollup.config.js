import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/turn.js',
  output: [
    {
      file: 'dist/turn.js',
    },
    {
      file: 'dist/turn.min.js',
      plugins: [terser()]
    }
  ]
}
