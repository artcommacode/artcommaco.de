import {readdirSync} from 'fs'
import {join} from 'path'

export default (): string[] => readdirSync(join(process.cwd(), './src/posts')).reverse()
