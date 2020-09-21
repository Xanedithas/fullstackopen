const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
//const middleware = require("./utils/middleware")

app.use(cors())
app.use(express.json())
//app.use(middleware.requestLogger)

mongoose.connect(
	process.env.MONGODB_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true }
)

const blogsRouter = require("./controllers/blogs")
app.use("/api/blogs", blogsRouter)

module.exports = app