import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

import gulp from 'gulp'
import through from 'through2'
import source from 'vinyl-source-stream'
import terser from 'gulp-terser'

import rollupStream from '@rollup/stream'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import minifyHtml from 'rollup-plugin-minify-html-template-literals'
import cleanup from 'rollup-plugin-cleanup'

const { src, dest, series, parallel, watch } = gulp

const header = filePath =>
  through.obj((file, _, callback) => {
    const headerContent = String(
      fs.readFileSync(path.join(process.cwd(), filePath))
    )
    file.contents = Buffer.from(headerContent + String(file.contents))
    callback(null, file)
  })

const clean = () => exec('rm -rf dist')

const build = () => {
  const options = {
    input: 'src/index.ts',
    output: { format: 'iife' },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      typescript(),
      minifyHtml(),
      cleanup()
    ]
  }
  return rollupStream(options)
    .pipe(source('app.js'))
    .pipe(dest('dist/extension'))
}

const addHeader = () =>
  src('dist/extension/app.js')
    .pipe(header('src/extension/meta.js'))
    .pipe(dest('dist/userscript'))

const minifyJS = () =>
  src('dist/extension/app.js', { base: '.' }).pipe(terser()).pipe(dest('.'))

const mix = () =>
  src([
    'src/extension/content.js',
    'src/extension/manifest.json',
    'src/img/*'
  ]).pipe(dest('dist/extension'))

const pack = () => {
  const name = 'extension'
  return exec(
    `cd dist/${name} && zip -r ${name}.zip . && mv ${name}.zip ../${name}.zip`
  )
}

const server = () => {
  watch('src/**/*', { ignoreInitial: false }, build)
}

export default series(
  clean,
  parallel(series(build, parallel(addHeader, minifyJS)), mix),
  pack
)
export { server }
