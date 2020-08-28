import gulp from 'gulp'
import source from 'vinyl-source-stream'
import terser from 'gulp-terser'
import del from 'del'
import rollupStream from '@rollup/stream'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import minifyHtml from 'rollup-plugin-minify-html-template-literals'

const { src, dest, series, parallel, watch } = gulp

function clean () {
  return del('dist')
}

function build () {
  const options = {
    input: 'src/app.ts',
    output: { format: 'iife' },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      minifyHtml(),
      typescript()
    ]
  }
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(dest('dist/extension'))
}

function minifyJS () {
  return src('dist/extension/app.js', { base: '.' })
    .pipe(terser())
    .pipe(dest('.'))
}

function mix () {
  return src([
    'src/img/icon.png',
    'src/extension/content.js',
    'src/extension/manifest.json'
  ]).pipe(dest('dist/extension'))
}

function server () {
  watch('src/**/*', { ignoreInitial: false }, build)
}

export default series(clean, parallel(series(build, minifyJS), mix))
export { server }
