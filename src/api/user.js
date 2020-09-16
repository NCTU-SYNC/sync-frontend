import request from '@/plugins/request'
import config from './config'

export function login (data) {
  return request({
    url: config.baseURL + '/login',
    method: 'post',
    data
  })
}

export function getEditPostIds (idToken) {
  return request({
    url: config.baseURL + `/user/editPostIds?idToken=${idToken}`,
    method: 'get'
  })
}
