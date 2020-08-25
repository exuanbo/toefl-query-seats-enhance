import gulp from 'gulp'
import source from 'vinyl-source-stream'
import terser from 'gulp-terser'
import del from 'del'
import rollupStream from '@rollup/stream'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import minifyHtml from 'rollup-plugin-minify-html-template-literals'

const { src, dest, series, parallel, watch } = gulp

function clean () {
  return del('dist')
}

function build () {
  const options = {
    input: 'src/js/app.js',
    output: { format: 'iife' },
    plugins: [nodeResolve({ browser: true }), commonjs(), minifyHtml()]
  }
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(dest('dist/extension'))
}

function minifyJS () {
  return src('dist/extension/app.js')
    .pipe(terser())
    .pipe(dest('dist/extension'))
}

function mix () {
  return src(['src/img/icon.png', 'src/js/content.js', 'src/manifest.json'])
    .pipe(dest('dist/extension'))
}

function server () {
  watch('src/js/**', { ignoreInitial: false }, build)
}

export default series(clean, parallel(series(build, minifyJS), mix))
export { server }
