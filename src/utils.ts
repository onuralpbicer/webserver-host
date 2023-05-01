import path from 'path'
import http from 'http'

const hostname = process.env['HOSTNAME'] ?? 'onuralpbicertest.com'

export interface FSError extends Error {
    code: string
}

export function getSubdomain(host: string) {
    const subdomain = host.replace(hostname, '')?.slice(0, -1)
    return subdomain === 'www' ? '' : subdomain
}

export function getFilePath(
    url: string | undefined,
    defaultFile = 'index.html',
) {
    if (url === '/') return defaultFile
    return url || defaultFile
}

export function isWithinProject(filePath: string, projectPath: string) {
    const relative = path.relative(projectPath, filePath)
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}

/**
 * https://github.com/ericbarch/socket-tunnel/blob/460c6d8d055f4c417f1da6fc7ee21643859fd2ef/server.js#L123
 * @param req
 * @param url
 * @returns
 */
export function getReqLine(req: http.IncomingMessage, url?: string) {
    return `${req.method} ${url ?? req.url} HTTP/${req.httpVersion}`
}

/**
 * https://github.com/ericbarch/socket-tunnel/blob/460c6d8d055f4c417f1da6fc7ee21643859fd2ef/server.js#L127
 * @param req
 * @param url
 * @returns
 */
export function getHeaders(req: http.IncomingMessage) {
    const headers = []

    for (let i = 0; i < req.rawHeaders.length - 1; i += 2) {
        headers.push(req.rawHeaders[i] + ': ' + req.rawHeaders[i + 1])
    }

    return headers
}
