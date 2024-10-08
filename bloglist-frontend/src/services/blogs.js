import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async (newObject) => {
  const config = { headers: { Authorization: token } }
  const response  = await axios.post(baseUrl, newObject, config)
  return response.data
}

const changeBlog = async (id, newObject) => {
  const blogUrl = baseUrl + '/' + id
  const response  = await axios.put(blogUrl,newObject)
  return response.data
}

const deleteBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  const blogUrl = baseUrl + '/' + id
  await axios.delete(blogUrl, config)
}



export default { setToken, getAll, create, changeBlog, deleteBlog }