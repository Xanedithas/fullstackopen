const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async(req, res) => {
	const { username, password } = req.body

	if (!username || !password) return res.status(401).json({ error: "Invalid username or password" })

	const user = await User.findOne({ username })

	if (!user || !user.hash) return res.status(401).json({ error: "Invalid user" })

	const passwordMatch = await bcrypt.compare(password, user.hash)

	if (!user || !passwordMatch) return res.status(401).json({ error: "Invalid username or password" })

	const token = jwt.sign({ username, id: user._id }, process.env.SECRET)

	return res.status(200).send({ token, username, name: user.name })
})

module.exports = loginRouter