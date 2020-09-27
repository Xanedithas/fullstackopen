const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({})
	res.json(blogs)
})

blogsRouter.get("/:id", async (req, res) => {
	const { id } = req.params
	const blogs = await Blog.findById(id)
	res.json(blogs)
})

blogsRouter.post("/", async (req, res) => {
	const { body } = req
	if (!body.title || !body.url) return res.status(400).end()
	const blog = new Blog(body)
	//console.log(JSON.stringify(JSON.parse(blog)))
	const result = await blog.save()
	res.status(201).json(result)
})

blogsRouter.put("/:id", async (req, res) => {
	const { body } = req
	const { id } = req.params
	const result = await Blog.findByIdAndUpdate(id, body)
	res.status(200).json(result)
})

blogsRouter.delete("/:id", async (req, res) => {
	const { id } = req.params
	const result = await Blog.findByIdAndRemove(id)
	res.status(204).json(result)
})

module.exports = blogsRouter