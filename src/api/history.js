import request from '@/utils/request'
import config from './config'

export function getArticleVersionById(data) {
  return request({
    url: config.baseURL + `/history/${data.articleId}`,
    method: 'get',
    params: {
      versionIndex: data.versionIndex
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
