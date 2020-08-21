const { src, dest, series, parallel, watch } = require('gulp')
const del = require('del')
const rollupStream = require('@rollup/stream')
const source = require('vinyl-source-stream')

function clean () {
  return del('dist')
}

function build () {
  const options = {
    input: 'src/js/app.js',
    output: { format: 'iife' }
  }
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(dest('dist/extension'))
}

function mix () {
  return src(['src/img/icon.png', 'src/js/content.js', 'src/manifest.json'])
    .pipe(dest('dist/extension'))
}

exports.default = series(clean, parallel(build, mix))
exports.watch = () => { watch('src/js/**', build) }
