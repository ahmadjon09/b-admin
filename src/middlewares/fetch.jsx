import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('admin_token')
const BASE_URL = 'https://b-market-server.onrender.com/api/'

// const BASE_URL = 'http://localhost:8000/api/'

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token
  }
})

export default instance
