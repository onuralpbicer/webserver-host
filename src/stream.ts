import fs from 'fs'
import mime from 'mime'
import { FSError } from './utils'
import { ServerResponse } from 'http'

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
