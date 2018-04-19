import * as purify from 'purify-css'

const render = (posts: Post[], nextPrev: string, css: string) => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Art, Code</title>
      <meta name="viewport" content="width=device-width initial-scale=1 maximum-scale=1 user-scalable=no" />
      <link rel="shortcut icon" href="/favicon.png" />
      <style>${css}</style>
    </head>
    <body>
      ${posts
        .map(
          ({attributes, html}, i) => `
        <h1><a href="/posts/${attributes.slug}.html">${attributes.title}</a></h1>
        ${html}
        ${i < posts.length - 1 ? '<hr>' : ''}
      `
        )
        .join('\n')}
      ${nextPrev}
    </body>
  </html>
`

const renderNextPrev = (posts: Post[], pageNum: number, pagesTotal: number) => {
  const prev =
    pageNum > 2
      ? `<a class="prev" href="/pages/${pageNum - 1}.html"/>&larr;</a>`
      : pageNum > 1 ? '<a class="prev" href="/"/>&larr;</a>' : ''
  const next =
    pageNum < pagesTotal ? `<a class="next" href="/pages/${pageNum + 1}.html"/>&rarr;</a>` : ''
  return `<div class="prev-next">${prev} ${next}</a>`
}

export default (posts: Post[], css: string, pageNum: number, pagesTotal: number) => {
  const nextPrev = renderNextPrev(posts, pageNum, pagesTotal)
  const content = render(posts, nextPrev, '')
  const purifiedCSS = purify(content, css, {minify: true})
  return render(posts, nextPrev, purifiedCSS)
}
