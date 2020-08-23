import gulp from 'gulp'
import del from 'del'
import rollupStream from '@rollup/stream'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import terser from 'gulp-terser'

const { src, dest, series, parallel, watch } = gulp

function clean () {
  return del('dist')
}

function build () {
  const options = {
    input: 'src/js/app.js',
    output: { format: 'iife' },
    plugins: [nodeResolve()]
  }
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(terser({ keep_fnames: true, mangle: false }))
    .pipe(dest('dist/extension'))
}

function mix () {
  return src(['src/img/icon.png', 'src/js/content.js', 'src/manifest.json'])
    .pipe(dest('dist/extension'))
}

function server() {
  watch('src/js/**', build)
}

export default series(clean, parallel(build, mix))
export { server }
