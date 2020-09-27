const express = require("express")
const app = express()
require('express-async-errors')
const cors = require("cors")
const mongoose = require("mongoose")
mongoose.set('useFindAndModify', false);
//const middleware = require("./utils/middleware")
const config = require("./utils/config")

app.use(cors())
app.use(express.json())
//app.use(middleware.requestLogger)

mongoose.connect(
	config.MONGODB_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true }
)

const blogsRouter = require("./controllers/blogs")
app.use("/api/blogs", blogsRouter)

module.exports = app