const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (req, res) => {
	const users = await User.find({}).populate("blogs")
	res.json(users)
})

usersRouter.post("/", async (req, res) => {
	const { username, name, password } = req.body

	// Return error in json, may change later to pass it to error handler
	if (!username || !password) {
		return res.status(400).json({ error: "Username and Password are required" })
	}
	if (username.length < 3 || password.length < 3) {
		return res.status(400).json({ error: "Username and Password need to be at least 3 characters long" })
	}

	// https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds
	const saltRounds = 10
	const hash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		hash,
	})

	const savedUser = await user.save()

	res.status(201).json(savedUser)
})

module.exports = usersRouter