import request from '@/utils/request'
import config from './config'

export function login(data) {
  return request({
    url: config.baseURL + `/login`,
    method: 'post',
    data
  })
}

export function getProfile(data) {
  return request({
    url: config.baseURL + `/profile`,
    method: 'post',
    data
  })
}

export function addViewArticleById(data) {
  return request({
    url: config.baseURL + `/profile/view`,
    method: 'post',
    data
  })
}

export function subscribeArticleById(data) {
  return request({
    url: config.baseURL + `/profile/subscribe`,
    method: 'post',
    data
  })
}

export function getArticlesInfo(data) {
  return request({
    url: config.baseURL + `/profile/article`,
    method: 'post',
    data
  })
}
