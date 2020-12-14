import request from '@/utils/request'
import config from './config'

export function getArticleRevisionById(articleId) {
  return request({
    url: config.baseURL + `/history/${articleId}`,
    method: 'get'
  })
}
