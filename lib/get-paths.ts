import {readdirSync} from 'fs'
import {join} from 'path'

export default () => (
  readdirSync(join(process.cwd(), './posts')).reverse()
)
