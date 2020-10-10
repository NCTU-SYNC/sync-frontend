export const getters = {
  isLogin: state => state.user.authenticated,
  token: state => state.user.token,
  displayName: state => state.user.displayName,
  photoURL: state => state.user.photoURL
}

export const store = this

const cookieparser = process.server ? require('cookieparser') : undefined

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    const hasCookieInReq = !!req.headers.cookie
    if (hasCookieInReq) {
      try {
        const { userInfo } = cookieparser.parse(req.headers.cookie)
        console.log(userInfo)
        commit('user/SET_USER', userInfo)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
