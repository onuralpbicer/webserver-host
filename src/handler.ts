import http from 'http'
import path from 'path'
import { getSubdomain, getFilePath, isWithinProject } from './utils'
import { streamFileToResponse } from './stream'

const baseLocation =
    process.env['BASE_LOCATION'] ?? path.join(process.cwd(), 'apps')

const handler: http.RequestListener = (req, res) => {
    const projectFolder = getSubdomain(req.headers.host ?? '') || 'index'

    const projectDir = path.join(baseLocation, projectFolder)
    const filePath = getFilePath(req.url)

    const fileLocation = path.join(projectDir, filePath)

    const isWithin = isWithinProject(fileLocation, projectDir)

    if (!isWithin) {
        res.statusCode = 404
        res.end()
        return
    }

    streamFileToResponse(res, fileLocation)
}

export default handler
