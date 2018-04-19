import * as purify from 'purify-css'

const render = ({title}: Post['attributes'], html: string, nextPrev: string, css: string) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title} | Art, Code</title>
      <meta name="viewport" content="width=device-width initial-scale=1 maximum-scale=1 user-scalable=no" />
      <link rel="shortcut icon" href="/favicon.png" />
      <style>${css}</style>
    </head>
    <body>
      <h1>${title}</h1>
      ${html}
      ${nextPrev}
    </body>
  </html>
`

const renderNextPrev = (posts: Post[], post: Post) => {
  const i = posts.findIndex(({attributes}) => attributes.slug === post.attributes.slug)
  const prevPost = posts[i - 1]
  const nextPost = posts[i + 1]
  const back = '<a class="back" href="/">&darr;</a>'
  const prev = prevPost
    ? `<a class="prev" href="/posts/${prevPost.attributes.slug}.html"/>&larr;</a>`
    : ''
  const next = nextPost
    ? `<a class="next" href="/posts/${nextPost.attributes.slug}.html"/>&rarr;</a>`
    : ''
  return `<div class="prev-next">${prev} ${back} ${next}</a>`
}

export default (post: Post, css: string, posts: Post[]) => {
  const {attributes, html} = post
  const nextPrev = renderNextPrev(posts, post)
  const content = render(attributes, html, nextPrev, '')
  const purifiedCSS = purify(content, css, {minify: true})
  return render(attributes, html, nextPrev, purifiedCSS)
}
