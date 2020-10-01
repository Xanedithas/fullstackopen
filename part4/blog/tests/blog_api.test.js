const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")
const User = require("../models/user")

/*
beforeEach(async () => {
    await Blog.deleteMany({})
})
*/

// Status: Currently any "authorized" user can create, update, and remove any post.

describe("when user post blog", () => {

	const username = "Pokeball"
	const name = "Ash Ketchum"
	const password = "P1k4chu!"

	let token = ""

	let entry = {
		title: "Advanced automated testing on the backend",
		url: "127.0.0.1:3001/api/"
	}

	test("empty database", async () => {
		await Blog.deleteMany({})
		await User.deleteMany({})
		await api
			.get("/api/blogs")
			.expect(200)
			.expect(res => res.body.length === 0)
		await api
			.get("/api/users")
			.expect(200)
			.expect(res => res.body.length === 0)
	})

	test("register user", async () => {
		await api
			.post("/api/users")
			.send({ username, name, password })
			.expect(201)
	})

	test("receive token on login", async () => {
		const login = await api
			.post("/api/login")
			.send({ username, password })
			.expect(200)
		token = login.body.token
	})

	test("unauthorized user cannot add blog", async () => {
		await api
			.post("/api/blogs")
			.send(entry)
			.expect(401)
	})

	test("authorized user can add blog", async () => {
		await api
			.post("/api/blogs")
			.send(entry)
			.set("Authorization", `bearer ${token}`)
			.expect(201)
	})

	test("title and url are required", async () => {
		await api
			.post("/api/blogs")
			.send({ ...entry.title })
			.set("Authorization", `bearer ${token}`)
			.expect(400)
		await api
			.post("/api/blogs")
			.send({ ...entry.url })
			.set("Authorization", `bearer ${token}`)
			.expect(400)
	})

	test("blog exists", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(res => {
				res.body.length === 1 &&
				res.body[0].id !== null &&
				res.body[0].likes === 0
			})
	})

	test("user is populated in blog", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect(res => res.body[0].author.username === username)
	})

	test("blogs are populated in user", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect(res => res.body[0].blogs[0].title === entry.title)
	})

	test("unauthorized user cannot update blog", async () => {
		const blogs = await api.get("/api/blogs")
		const blog = blogs.body[0]
		const newTitle = entry.title + "!!!"

		await api
			.put(`/api/blogs/${blog.id}`)
			.send({ title: newTitle })
			.expect(401)
	})

	test("authorized user can update blog", async () => {
		const blogs = await api.get("/api/blogs")
		const blog = blogs.body[0]
		const newTitle = entry.title + "!!!"

		await api
			.put(`/api/blogs/${blog.id}`)
			.send({ title: newTitle })
			.set("Authorization", `bearer ${token}`)
			.expect(200)

		await api
			.get("/api/blogs")
			.expect(200)
			.expect(res => res.body[0].title === newTitle)
	})

	test("unauthorized user cannot remove blog", async () => {
		const blogs = await api.get("/api/blogs")

		await api
			.delete(`/api/blogs/${blogs.body[0].id}`)
			.expect(401)
	})

	// Functionality for authorization of removing and updating a blog is shared, no need to test twice.
	test("only the author can remove blog", async () => {
		const faux = { username: "alan", password: "turing" }
		// Register a new user for this test
		await api
			.post("/api/users")
			.send(faux)
			.expect(201)

		// Get token for this new user
		const login = await api
			.post("/api/login")
			.send(faux)
			.expect(200)

		const blogs = await api.get("/api/blogs")

		await api
			.delete(`/api/blogs/${blogs.body[0].id}`)
			.set("Authorization", `bearer ${login.body.token}`)
			.expect(401)
	})

	test("authorized user can remove blog", async () => {
		const blogs = await api.get("/api/blogs")

		await api
			.delete(`/api/blogs/${blogs.body[0].id}`)
			.set("Authorization", `bearer ${token}`)
			.expect(204)

		await api
			.get("/api/blogs")
			.expect(res => res.body.length === 0)
	})
})

afterAll(() => {
	mongoose.connection.close()
})