import {createServer} from 'http'
import * as express from 'express'

const app = express()
app.use(express.static('dist'))

export default () => {
  app.listen(process.env.PORT || 8080)
}
