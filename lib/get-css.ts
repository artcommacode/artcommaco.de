import {compile} from 'sass'
import {readFileSync} from 'fs'
import {join} from 'path'

export default (): string => {
  const {css} = compile(join(process.cwd(), './src/sass/main.scss'))
  return css.toString()
}
