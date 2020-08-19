const { src, dest, series, parallel } = require('gulp')
const del = require('del')
const rollupStream = require('@rollup/stream')
const source = require('vinyl-source-stream')

function clean() {
  return del('dist')
}

const options = {
  input: 'src/js/main.js',
  output: { format: 'iife' }
}

function build() {
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(dest('dist'))
}

function mix() {
  return src(['src/img/icon.png', 'src/js/index.js', 'src/manifest.json'])
    .pipe(dest('dist'))
}

exports.default = series(clean, parallel(build, mix))
