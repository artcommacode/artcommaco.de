import * as Md from 'markdown-it'
import * as fm from 'front-matter'
import {highlight} from 'highlight.js'
import {readFileSync} from 'fs'
import {join} from 'path'
import resizeImage from './resize-image'

let md = Md({
  html: true,
  typographer: true,
  highlight: (str, lang) => highlight(lang, str).value
})

md.renderer.rules.image = (tokens, i) => {
  const token = tokens[i]
  const src = token.attrs[token.attrIndex('src')][1]
  const [w760, w1280] = [760, 1280].map(resizeImage(src))
  return `<img
    alt="${token.content}"
    srcset="${w760}1x, ${w1280} 2x"
    src="${w760}"
  >`
}

export default (path: string): Post => {
  const slug = path.split('.')[0]
  const file = readFileSync(join(process.cwd(), `./src/posts/${path}`), 'utf8')
  const {attributes, body} = fm(file)
  const html = md.render(body)
  return {attributes: {...attributes, slug}, html}
}
