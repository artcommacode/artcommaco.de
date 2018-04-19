import {extname} from 'path'
import * as sharp from 'sharp'

export default (path: string) => (width: number): string => {
  const ext = extname(path)
  const outPath = `${path.replace(ext, '')}_${width}${ext}`
  sharp(`./src${path}`)
    .resize(width, undefined)
    .toFile(`./dist${outPath}`)
  return outPath
}
