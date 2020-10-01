const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const Tokens = require("../utils/tokens")

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("author")
	res.json(blogs)
})

blogsRouter.get("/:id", async (req, res) => {
	const { id } = req.params
	const blogs = await Blog.findById(id).populate("author")
	res.json(blogs)
})

blogsRouter.post("/", async (req, res) => {
	let { title, url, likes } = req.body

	if (!title || !url) return res.status(400).end()

	const user = await Tokens.userFromToken(req.token)

	if (!user) return res.status(401).json({ error: "User not found" })
	if (user.error) return res.status(401).json({ error: user.error })

	// Any logged in user can post a blog

	const blog = new Blog({
		title,
		url,
		likes,
		author: user._id
	})
	const savedBlog = await blog.save()

	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	return res.status(201).json(savedBlog)
})

blogsRouter.put("/:id", async (req, res) => {
	const { body } = req
	const { id } = req.params

	if (!body || !id) return res.status(400).end()

	const user = await Tokens.userFromToken(req.token)

	if (!user) return res.status(401).json({ error: "User not found" })
	if (user.error) return res.status(401).json({ error: user.error })

	const blog = await Blog.findById(id)
	if (!blog) return res.status(404).json({ error: "Blog not found" })
	if (blog.author.toString() !== user.id.toString()) return res.status(401).json({ error: "Only the author can update their blogs" })

	// .update does not offer the same functionality as .findByIdAndUpdate
	const result = await Blog.findByIdAndUpdate(id, body)
	res.status(200).json(result)
})

blogsRouter.delete("/:id", async (req, res) => {
	const { id } = req.params

	if (!id) return res.status(400).end()

	const user = await Tokens.userFromToken(req.token)

	if (!user) return res.status(401).json({ error: "User not found" })
	if (user.error) return res.status(401).json({ error: user.error })

	const blog = await Blog.findById(id)
	if (!blog) return res.status(404).json({ error: "Blog not found" })
	if (blog.author.toString() !== user.id.toString()) return res.status(401).json({ error: "Only the author can remove their blogs" })

	user.blogs = user.blogs.filter(x => x.id.toString() !== id)
	await user.save()

	// .remove is deprecated, only proper way to remove is to find it again and remove
	const result = await Blog.findByIdAndRemove(id)
	res.status(204).json(result)
})

module.exports = blogsRouter