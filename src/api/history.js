import request from '@/utils/request'
import config from './config'

export function getArticleVersionsById(data) {
  return request({
    url: config.baseURL + `/history/${data.articleId}`,
    method: 'get',
    params: {
      limit: data.limit,
      page: data.page
    }
  })
}
export function getBlockRevisionById(data) {
  return request({
    url: config.baseURL + `/revision/${data.blockId}`,
    method: 'get',
    params: {
      blockIndex: data.revisionIndex
    }
  })
}
