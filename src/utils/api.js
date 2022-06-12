import axios from 'axios'

function getBaseURL() {
  return process.env.VUE_APP_BASE_URL + process.env.VUE_APP_API_URL
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000
})

export { axios, api }
