const express = require("express")
const app = express()
require("express-async-errors")
const cors = require("cors")
const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)
const middleware = require("./utils/middleware")
const config = require("./utils/config")
const tokens = require("./utils/tokens")

app.use(cors())
app.use(express.json())
//app.use(middleware.requestLogger)
app.use(tokens.tokenHeaderToRequest)

mongoose.connect(
	config.MONGODB_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
)

const usersRouter = require("./controllers/users")
app.use("/api/users", usersRouter)

const blogsRouter = require("./controllers/blogs")
app.use("/api/blogs", blogsRouter)

const loginRouter = require("./controllers/login")
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app