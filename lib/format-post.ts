import * as Md from 'markdown-it'
import * as fm from 'front-matter'
import {highlight} from 'highlight.js'
import {readFileSync} from 'fs'
import {join} from 'path'

const md = Md({
  html: true,
  typographer: true,
  highlight: (str, lang) => highlight(lang, str).value
})

md.renderer.rules.image = (tokens, i) => {
  const token = tokens[i]
  const src = token.attrs[token.attrIndex('src')][1]
  const newSrc = process.env.NODE_ENV === 'production' ? `https://art-code.imgix.net${src}` : src
  return `<img 
    srcset="
      ${newSrc}?w=760 1x,
      ${newSrc}?w=760&fit=max&q=80&dpr=2 2x,
      ${newSrc}?w=760&fit=max&q=60&dpr=3 3x" 
    src="${newSrc}?w=760"
  >`
}

export default path => {
  const slug = path.split('.')[0]
  const file = readFileSync(join(process.cwd(), `./posts/${path}`), 'utf8')
  const {attributes, body} = fm(file)
  const html = md.render(body)
  return {attributes: {...attributes, slug}, html}
}
