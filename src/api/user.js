import request from '@/plugins/request'
import config from './config'

export function login (data) {
  return request({
    url: config.baseURL + '/login',
    method: 'post',
    data
  })
}
