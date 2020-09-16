const logger = require('./logger')

const requestLogger = (request, response, next) => {
    const { method, path, body } = request
    logger.info(`Method: ${method} | Path: ${path} | Body: ${JSON.stringify(body)}`)
    next()
}

module.exports = { requestLogger }