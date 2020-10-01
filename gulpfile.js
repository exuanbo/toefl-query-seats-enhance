import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import gulp from 'gulp'
import through from 'through2'
import source from 'vinyl-source-stream'
import terser from 'gulp-terser'
import rollupStream from '@rollup/stream'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import minifyHtml from 'rollup-plugin-minify-html-template-literals'

const { src, dest, series, parallel, watch } = gulp

const header = filePath => {
  return through.obj((file, _, callback) => {
    const headerContent = String(fs.readFileSync(path.join(process.cwd(), filePath)))
    file.contents = Buffer.from(headerContent + String(file.contents))
    callback(null, file)
  })
}

function clean () {
  return exec('rm -rf dist')
}

function build () {
  const options = {
    input: 'src/index.ts',
    output: { format: 'iife' },
    plugins: [nodeResolve({ browser: true }), commonjs(), minifyHtml(), typescript()]
  }
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(dest('dist/extension'))
}

function addHeader () {
  return src('dist/extension/app.js')
    .pipe(header('src/extension/meta.js'))
    .pipe(dest('dist/userscript'))
}

function minifyJS () {
  return src('dist/extension/app.js', { base: '.' })
    .pipe(terser())
    .pipe(dest('.'))
}

function mix () {
  return src(['src/extension/content.js', 'src/extension/manifest.json', 'src/img/*']).pipe(
    dest('dist/extension')
  )
}

function pack () {
  const name = 'extension'
  return exec(`cd dist/${name} && zip -r ${name}.zip . && mv ${name}.zip ../${name}.zip`)
}

function server () {
  watch('src/**/*', { ignoreInitial: false }, build)
}

export default series(clean, parallel(series(build, parallel(addHeader, minifyJS)), mix), pack)
export { server }
