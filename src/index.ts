import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import handler from './handler'

const HTTP_PORT = process.env['PORT'] ?? 80

const httpServer = http.createServer(handler)

httpServer.listen(HTTP_PORT, () => {
    console.log(`http listening on ${HTTP_PORT}`)
})
