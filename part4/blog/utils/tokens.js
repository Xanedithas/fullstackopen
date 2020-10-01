const jwt = require("jsonwebtoken")
const User = require("../models/user")

const tokenFromRequest = req => {
	if (!req) return null
	const auth = req.get("authorization")
	if (!auth) return null
	const isBearer = auth.toLowerCase().substr(0, 7) === "bearer "
	if (isBearer) return auth.substr(7)
	return { error: "Invalid token" }
}

const userFromToken = async (token) => {
	if (!token) return null
	const decoded = jwt.verify(token, process.env.SECRET)
	if (!decoded.id) return { error: "Invalid token" }
	const user = await User.findById(decoded.id)
	if (!user) return { error: "User not found" }
	return user
}

const tokenHeaderToRequest = (req, res, next) => {
	const token = tokenFromRequest(req)

	/*if (!token) return res.status(401).json({ error: "Token not found" })
    if (token.error) return res.status(401).json({ ...token.error })*/

	if (token) req.token = token

	next()
}

module.exports = { tokenFromRequest, userFromToken, tokenHeaderToRequest }