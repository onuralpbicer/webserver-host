import path from 'path'

const defaultHostname =
    process.env['NODE_ENV'] === 'development'
        ? 'onuralpbicertest.com'
        : 'onuralpbicer.com'

export const HOSTNAME = process.env['HOSTNAME'] ?? defaultHostname
export const HTTP_PORT = process.env['PORT'] ?? 80

const defaultProjectBaseLocation =
    process.env['NODE_ENV'] === 'development'
        ? path.join(process.cwd(), 'apps')
        : '/var/www'

export const PROJECTS_BASE_LOCATION =
    process.env['PROJECTS_BASE_LOCATION'] ?? defaultProjectBaseLocation

export const PORT_FILE = process.env['PORT_FILE'] ?? '.port'

export const BASE_API_PATH = process.env['BASE_API_PATH'] ?? 'api'
