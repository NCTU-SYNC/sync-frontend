import axios from 'axios'
import _ from 'lodash'

function getBaseURL() {
  return process.env.VUE_APP_BASE_URL + process.env.VUE_APP_API_URL
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000
})

api.interceptors.request.use(
  (config) => {
    if (!_.has(config, 'data')) {
      config.data = {}
    }
    config.data.token = 'token'

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

export { axios, api, getBaseURL }
