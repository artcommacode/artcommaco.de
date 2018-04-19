import * as Md from 'markdown-it'
import * as fm from 'front-matter'
import {highlight} from 'highlight.js'
import {readFileSync} from 'fs'
import {join} from 'path'
import resizeImage from './resize-image'

const md = Md({
  html: true,
  typographer: true,
  highlight: (str, lang) => highlight(lang, str).value
})

md.renderer.rules.image = (tokens, i) => {
  const token = tokens[i]
  const src = token.attrs[token.attrIndex('src')][1]
  const [w760, w1520, w2280] = [760, 1520, 2280].map(resizeImage(src))
  return `<img
    srcset="${w760}1x, ${w1520} 2x, ${w2280} 3x"
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
