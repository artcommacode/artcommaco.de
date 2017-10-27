import buildPost from './build-post'
import buildPage from './build-page'
import formatPost from './format-post'
import getPaths from './get-paths'
import getCss from './get-css'
import chunk from './chunk'
import {writeFileSync} from 'fs'
import {join} from 'path'

const write = (path, data) => writeFileSync(join(process.cwd(), path), data)

const writePost = (css) => (post, _, posts) => {
  const html = buildPost(post, css, posts)
  return write(`./dist/posts/${post.attributes.slug}.html`, html)
}

const writePage = (css) => (posts, i, chunks) => {
  const html = buildPage(posts, css, i + 1, chunks.length)
  return i === 0
    ? write(`./dist/index.html`, html)
    : write(`./dist/pages/${i + 1}.html`, html)
}

export default () => {
  const css = getCss()
  const posts = getPaths().filter((path) => path[0] !== '_').map(formatPost)
  posts.map(writePost(css))
  chunk(posts, 10).map(writePage(css))
}
