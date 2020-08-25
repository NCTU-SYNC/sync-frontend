import request from '@/utils/request'
import config from './config'

export function login(data) {
  return request({
    url: config.baseURL + `/login`,
    method: 'post',
    data
  })
}

export function storeArticleIdToFirestore(uid, articleId) {
  return request({
    url: config.baseURL + '/storeArticleId',
    method: 'post',
    data: { uid, articleId }
  })
}
