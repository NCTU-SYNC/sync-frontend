export const getters = {
  isLogin: state => state.user.authenticated,
  token: state => state.user.token,
  displayName: state => state.user.displayName,
  photoURL: state => state.user.photoURL
}
