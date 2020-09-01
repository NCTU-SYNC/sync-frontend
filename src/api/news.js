import request from '@/utils/request'
import config from './config'

export function getNews(data) {
  return request({
    url: config.baseURL + `/news`,
    method: 'get',
    params: data
  })
}
