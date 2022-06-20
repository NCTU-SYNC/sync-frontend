import axios from 'axios'
import _ from 'lodash'

import firebaseAuth from '@/utils/firebase'

export function getBaseURL() {
  return process.env.VUE_APP_BASE_URL + process.env.VUE_APP_API_URL
}

export function getToken() {
  return firebaseAuth.token
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000
})

api.interceptors.request.use(
  (config) => {
    if (config.method !== 'post' && config.method !== 'put') return config

    if (!_.has(config, 'data')) {
      config.data = {}
    }
    config.data.token = getToken()

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

export { axios, api }
