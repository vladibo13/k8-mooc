import axios from "axios"
const baseUrl = '/api/todos'

const get = async () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async (newTodo) => {
    const request = axios.post(baseUrl, newTodo)
    return request.then(response => response.data)
}

export default {get, create}