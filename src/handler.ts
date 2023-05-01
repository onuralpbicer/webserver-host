import http from 'http'
import path from 'path'
import { getSubdomain, getFilePath, isWithinProject } from './utils'
import { streamApiToResponse, streamFileToResponse } from './stream'
import fs from 'fs'
import chokidar from 'chokidar'
import { BASE_API_PATH, PORT_FILE, PROJECTS_BASE_LOCATION } from './environment'

// Watch for the projects folder and read the port from the .port file
const projectPortMap = new Map<string, number>()
chokidar.watch(PROJECTS_BASE_LOCATION).on('all', (eventName, filename) => {
    if (!filename.endsWith(PORT_FILE)) return

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
    try {
        const project = getSubdomain(req.headers.host ?? '') || 'index'

        const projectDir = path.join(PROJECTS_BASE_LOCATION, project)
        const filePath = getFilePath(req.url)

        const fileLocation = path.join(projectDir, filePath)

        const isWithin = isWithinProject(fileLocation, projectDir)

        if (!isWithin) {
            res.statusCode = 404
            res.end()
            return
        }

        if (filePath.startsWith(`/${BASE_API_PATH}`)) {
            // is api request
            const port = projectPortMap.get(project)
            if (!port) {
                res.statusCode = 404
                res.end(0)
                return
            }

            const apiPath = filePath.replace(`/${BASE_API_PATH}`, '')
            streamApiToResponse(req, res, port, apiPath)
        } else {
            // is resource request
            if (req.method === 'GET') streamFileToResponse(res, fileLocation)
            else {
                res.statusCode = 405
                res.end()
            }
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 500
        res.end()
    }
}

export default handler
