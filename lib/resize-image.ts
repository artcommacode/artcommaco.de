import {extname} from 'path'
import * as sharp from 'sharp'

export default (path: string) => (width: number): string => {
  const ext = extname(path)
  const outPath = `./dist${path.replace(ext, '')}_${width}${ext}`
  sharp(`./src${path}`)
    .resize(width, undefined)
    .toFile('./dist${path}')
  return outPath
}
