import axios from 'axios'

const baseUrl = "http://localhost:3001/api/persons"

const read = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}

const create = async (obj) => {
    const request = axios.post(baseUrl, obj)
    const response = await request
    return response.data
}

const update = async (id, obj) => {
    const request = axios.put(`${baseUrl}/${id}`, obj)
    const response = await request
    return response.data
}

const destroy = async (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    const response = await request
    return response.data
}

export default { create, read, update, destroy }