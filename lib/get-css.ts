import {renderSync} from 'node-sass'
import {readFileSync} from 'fs'
import {join} from 'path'

export default (): string => {
  const {css} = renderSync({file: join(process.cwd(), './src/sass/main.scss')})
  return css.toString()
}
