#! /usr/bin/env node
import {join} from 'path'
import * as minimist from 'minimist'
import serve from '../lib/serve'
import build from '../lib/build'
import watch from '../lib/watch'

const [script, ...argv] = process.argv.slice(2)
const args = minimist(argv)

switch (script) {
  case 'serve':
    serve()
    break
  case 'watch':
    watch(args._)
    break
  case 'build':
    build()
    break
  default:
    console.log(`ERROR: the command "${script}" wasn't found`)
    process.exit(1)
    break
}
