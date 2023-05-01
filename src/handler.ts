import http from 'http'
import path from 'path'
import { getSubdomain, getFilePath, isWithinProject } from './utils'
import { streamFileToResponse } from './stream'
import fs from 'fs'
import chokidar from 'chokidar'

const baseLocation =
    process.env['BASE_LOCATION'] ?? path.join(process.cwd(), 'apps')
const portFile = process.env['PORT_FILE'] ?? '.port'

const baseApiPath = process.env['BASE_API_PATH'] ?? 'api'

// Watch for the projects folder and read the port from the .port file
const projectPortMap = new Map<string, number>()
chokidar.watch(baseLocation).on('all', (eventName, filename) => {
    if (!filename.endsWith(portFile)) return

    const projectName = filename.split(path.sep).at(-2)
    if (!projectName) return

    console.log(eventName, projectName)
    if (eventName.startsWith('unlink')) projectPortMap.delete(projectName)
    else {
        const port = fs.readFileSync(filename, { encoding: 'utf-8' })
        if (port) projectPortMap.set(projectName, Number(port))
    }
})

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
