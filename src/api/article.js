import request from '@/utils/request'
import config from './config'

export function getArticles() {
  return request({
    url: config.baseURL + '/article',
    method: 'get'
  })
}
