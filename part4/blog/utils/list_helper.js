/*
const totalLikes = (blogs) => {
    let sum = 0
    for (const blog in blogs) {
        sum += blogs[blog].likes
    }
	return sum
}

const favoriteBlog = (blogs) => {
    if (!blogs.length) return []

    let index = 0
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > blogs[index].likes) {
            index = i
        }
    }
	return blogs[index]
}
*/

const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0)

const favoriteBlog = ([ ...blogs ]) => {
    if (!blogs.length) return []

   return blogs.sort((a, b) => b.likes - a.likes)[0]
}

const mostBlogs = (blogs) => {
    if (!blogs.length) return ""

    let arr = []

    for (let i = 0; i < blogs.length; i++) {
        let found = -1
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].author == blogs[i].author) found = j
        }
        if (found > -1) {
            arr[found].blogs++
        } else {
            arr.push({
                author: blogs[i].author,
                blogs: 1
            })
        }
    }

    return arr.sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (blogs) => {
    if (!blogs.length) return ""

    let arr = []

    for (let i = 0; i < blogs.length; i++) {
        let found = -1
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].author == blogs[i].author) found = j
        }
        if (found > -1) {
            arr[found].likes += blogs[i].likes
        } else {
            arr.push({
                author: blogs[i].author,
                likes: blogs[i].likes
            })
        }
    }

    return arr.sort((a, b) => b.likes - a.likes)[0]
}

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes }