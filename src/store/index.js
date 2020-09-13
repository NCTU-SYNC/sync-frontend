export const getters = {
  isLogin: state => state.user.authenticated,
  token: state => state.user.token,
  displayName: state => state.user.displayName,
  photoURL: state => state.user.photoURL
}

export const store = this

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    const hasCookieInReq = !!req.headers.cookie
    if (hasCookieInReq) {
      try {
        console.log(req.headers.cookie)
        const { userInfo } = req.headers.cookie
        commit('user/SET_USER', userInfo)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
