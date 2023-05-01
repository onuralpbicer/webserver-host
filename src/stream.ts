import fs from 'fs'
import mime from 'mime'
import { FSError, getHeaders, getReqLine } from './utils'
import { IncomingMessage, ServerResponse } from 'http'
import net from 'net'

export function streamFileToResponse(res: ServerResponse, file: string) {
    const readStream = fs.createReadStream(file)

    readStream.once('error', (error) => {
        res.setHeader('Content-type', '')
        if ((error as FSError).code === 'ENOENT') {
            res.statusCode = 404
            res.end()
        } else {
            console.error(error)
            res.statusCode = 500
            res.end()
        }
    })

    const mimeType = mime.getType(file)
    res.setHeader('Content-type', mimeType ?? 'text/plain')
    readStream.pipe(res)
}

export function streamApiToResponse(
    req: IncomingMessage,
    res: ServerResponse,
    port: number,
    apiPath: string,
) {
    const connection = net.connect({
        port,
    })

    const bodyChunks: Buffer[] = []

    req.on('data', (chunk) => {
        bodyChunks.push(chunk)
    })

    req.on('end', () => {
        const reqLine = getReqLine(req, apiPath)
        const headers = getHeaders(req)

        const body = bodyChunks.length ? Buffer.concat(bodyChunks) : null

        connection.write(reqLine)
        connection.write('\r\n')
        connection.write(headers.join('\r\n'))
        connection.write('\r\n\r\n')
        if (body) {
            connection.write(body)
        }
    })

    connection.pipe(req.socket)

    connection.once('error', (error) => {
        if ((error as FSError).code === 'ECONNREFUSED') {
            res.statusCode = 404
            res.end()
        } else {
            console.error(error)
            res.statusCode = 500
            res.end()
        }
    })
}
