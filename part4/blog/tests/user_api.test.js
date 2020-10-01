const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")

const mock = {
	username: "Pokeball",
	name: "Ash Ketchum",
	password: "P1k4chu!",
}

// I put this in a seperate test file, but jest was complaining
test("invalid endpoint", async () => {
	await api
		.get("/api/invalidendpoint")
		.expect(404)
})

describe("when post user", () => {

	test("database is empty", async () => {
		await User.deleteMany({})

		await api
			.get("/api/users")
			.expect(res => res.body.length === 0)
	})

	test("user can be added", async () => {
		await api
			.post("/api/users")
			.send(mock)
			.expect(201)
			.expect("Content-Type", "application/json; charset=utf-8")

		await api
			.get("/api/users")
			.expect(res => res.body.length === 1)
	})

	test("username must be unique", async () => {
		await api
			.post("/api/users")
			.send(mock)
			.expect(400)
			.expect(res => res.body.error.includes("`username` to be unique"))
	})

	test("fails when username or password are smaller than 3 characters", async () => {
		await api
			.post("/api/users")
			.send({
				username: "xx",
				password: "yyy"
			})
			.expect(400)

		await api
			.post("/api/users")
			.send({
				username: "xxx",
				password: "yy"
			})
			.expect(400)
	})

})

describe("when post login", () => {

	test("one user exists", async () => {
		await User.deleteMany({})

		await api
			.post("/api/users")
			.send(mock)
			.expect(201)

		await api
			.get("/api/users")
			.expect(res => res.body.length === 1)
	})

	test("user can login", async () => {
		const { username, password } = mock

		await api
			.post("/api/login")
			.send({ username, password })
			.expect(200)
	})

	test("wrong password is unauthorized", async () => {
		const { username } = mock

		await api
			.post("/api/login")
			.send({ username, password: "wrong" })
			.expect(401)
	})

})

afterAll(() => {
	mongoose.connection.close()
})