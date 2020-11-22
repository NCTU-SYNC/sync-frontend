export const getters = {
  isLogin: state => state.user.authenticated,
  token: state => state.user.token,
  displayName: state => state.user.displayName,
  photoURL: state => state.user.photoURL
}

export const store = this

// const cookieparser = process.server ? require('cookieparser') : undefined

export const actions = {
  async nuxtServerInit ({ commit }, { req }) {
    const hasCookieInReq = !!req.headers.cookie
    if (hasCookieInReq) {
      try {
        // console.log(this.$cookies.get('userInfo'))
        const userInfo = this.$cookies.get('userInfo')
        // const { userInfo } = cookieparser.parse(req.headers.cookie)
        await commit('user/SET_USER', userInfo)
        await commit('user/SET_TOKEN', userInfo.stsTokenManager.accessToken)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
