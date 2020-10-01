const logger = require("./logger")

const unknownEndpoint = (req, res) => res.status(404).end()

const errorHandler = async (err, req, res, next) => {
	if (!err) next()

	// Expected errors

	if (err.name === "ValidationError") {
		return res.status(400).send({ error: err.message })
	}

	// Unexpected errors

	logger.error(err)

	// Catch unexpected errors
	return res.status(500).send({ error: err.message })

	//next(err)
}

module.exports = { unknownEndpoint, errorHandler }