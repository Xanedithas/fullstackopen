const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require("../models/blog")

const mock = [
    {
        "title": "The beginning",
        "author": "Mike",
        "url": "https://fullstackopen.com/static/f800638504cdf371a12947fc31d52030/part-4.svg",
        "likes": 2
    },
    {
        "title": "The end",
        "author": "Mike",
        "url": "https://fullstackopen.com/static/f800638504cdf371a12947fc31d52030/part-4.svg",
    }
]

const mockPut = {
    "title": "The beginning of the end",
    "author": "Mike",
    "url": "https://fullstackopen.com/static/f800638504cdf371a12947fc31d52030/part-4.svg",
    "likes": 8
}

const invalidMock = {
    "author": "Mike",
    "likes": 6
}

/*beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = // get blogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})*/

test('database is empty', async () => {
    await Blog.deleteMany({})
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(0)
})

describe('when post blog', () => {

    test('blogs can be added', async () => {
        await api
            .post('/api/blogs')
            .send(mock[0])
            .expect(201)
    
        await api
            .post('/api/blogs')
            .send(mock[1])
            .expect(201)
    })
    
    test('title and url are required', async () => {
        await api
            .post('/api/blogs')
            .send(invalidMock)
            .expect(400)
    })

})

describe('when get blogs', () => {

    // Tests run in series flag: --runInBand
    // State for following functions can be shared so we only perform 1 request
    let res = {}
    
    test('mock blogs are returned', async () => {
        res = await api.get('/api/blogs')
        expect(res.body).toHaveLength(mock.length)
    })

    test('blogs are returned as json', async () => {
        expect(res.status).toBe(200)
        expect(res.type).toBe('application/json')
    })

    test('blogs without likes member has 0 likes', async () => {
        expect(res.body[0].likes).toBe(2)
        expect(res.body[1].likes).toBeDefined()
        expect(res.body[1].likes).toBe(0)
    })

    test('id is defined on returned blogs', async () => {
        expect(res.body[0].id).toBeDefined()
    })

})

describe('when put blog', () => {

    let updated = { ...mockPut }
    
    test('put blog', async () => {
        const old = await api.get('/api/blogs')
        updated.id = old.body[1].id
        await api
            .put(`/api/blogs/${updated.id}`)
            .send(updated)
            .expect(200)
    })
    
    test('updated blog is returned', async () => {
        const res = await api.get('/api/blogs')
        expect(res.body[1]).toEqual(updated)
    })

})

describe('when delete blog', () => {

    test('blogs can be removed', async () => {
        const res = await api.get('/api/blogs')
        await api
            .delete(`/api/blogs/${res.body[1].id}`)
            .expect(204)
        await api
            .delete(`/api/blogs/${res.body[0].id}`)
            .expect(204)
    })
    
    test('database is empty', async () => {
        const res = await api.get('/api/blogs')
        expect(res.body).toHaveLength(0)
    })

})

afterAll(() => {
    mongoose.connection.close()
})