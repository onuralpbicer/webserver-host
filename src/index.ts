import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import handler from './handler'
import { HTTP_PORT } from './environment'

const httpServer = http.createServer(handler)

httpServer.listen(HTTP_PORT, () => {
    console.log(`http listening on ${HTTP_PORT}`)
})
