import request from '@/utils/request'
import config from './config'
import store from '@/store'

export function getArticles() {
  if (store.getters.mode === 'DEBUG') {
    return request({
      url: config.baseURL + `/article`,
      method: 'get',
      params: {
        mode: 'DEBUG'
      }
    })
  }
  return request({
    url: config.baseURL + `/article`,
    method: 'get'
  })
}

export function getArticleById(articleId) {
  return request({
    url: config.baseURL + `/article/${articleId}`,
    method: 'get'
  })
}

export function createArticle(data) {
  return request({
    url: config.baseURL + `/article`,
    method: 'post',
    data
  })
}

export function updateArticleById(data) {
  return request({
    url: config.baseURL + `/article`,
    method: 'put',
    data
  })
}

export function searchArticles(data) {
  if (store.getters.mode === 'DEBUG') {
    data.mode = 'DEBUG'
  }
  return request({
    url: config.baseURL + `/search`,
    method: 'get',
    params: data
  })
}
