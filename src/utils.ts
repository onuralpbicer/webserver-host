import path from 'path'

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
