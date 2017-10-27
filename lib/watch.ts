import {createServer} from 'http'
import * as express from 'express'
import buildPost from './build-post'
import formatPost from './format-post'
import getCss from './get-css'

const app = express()
app.use('/fonts', express.static('dist/fonts'))
app.use('/images', express.static('dist/images'))

export default ([path, ...rest]) => {
  app.use('*', (req, res) => {
    const html = buildPost(formatPost(path), getCss(), [])
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  })
  app.listen(process.env.PORT || 8080)
}
