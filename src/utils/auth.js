import Cookies from 'js-cookie'

export function getUserInfo() {
  return Cookies.get('userInfo') && JSON.parse(Cookies.get('userInfo'))
}

export function setUserInfo(data) {
  return Cookies.set('userInfo', JSON.stringify(data))
}

export function removeUserInfo() {
  return Cookies.remove('userInfo')
}
