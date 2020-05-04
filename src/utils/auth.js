import Cookies from 'js-cookie'

const TokenKey = 'sync'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return Cookies.get('userInfo')
}

export function setUserInfo(data) {
  return Cookies.set('userInfo', JSON.stringify(data))
}

export function getExpiredTime() {
  return Cookies.get('id')
}

export function setExpiredTime(time) {
  return Cookies.set('id', time)
}
