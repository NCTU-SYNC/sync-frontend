/*import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, setExpiredTime } from '@/utils/auth'

const state = {
  token: getToken(),
  name: '',
  dept: '',
  mail: '',
  id: '',
  gender: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, payload) => {
    state.name = payload.name
    state.dept = payload.dept
    state.mail = payload.mail
    state.id = payload.id
    state.token = payload.token
    state.gender = payload.gender
  }
}

const actions = {
  // user login
  login ({ commit, dispatch }, userInfo) {
    const { id, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ id: id.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setExpiredTime(Date.now() + 3 * 24 * 60 * 60 * 1000)
        dispatch('getInfo')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      var userInfo = getUserInfo()
      if (state.name !== '') {
        resolve(state)
      }
      if (userInfo !== undefined) {
        userInfo = JSON.parse(userInfo)
        if (userInfo.name === '') {
          getInfo(state.token).then(response => {
            const { data } = response

            if (!data) {
              Promise.reject(new Error('Verification failed, please Login again.'))
            }

            commit('SET_USER', data)
            setUserInfo(data)
            resolve(data)
          }).catch(
            error => {
              reject(error)
            }
          )
        } else {
          commit('SET_USER', userInfo)
          resolve(userInfo)
        }
      } else {
        getInfo(state.token).then(response => {
          const { data } = response

          if (!data) {
            Promise.reject(new Error('Verification failed, please Login again.'))
          }

          commit('SET_USER', data)
          setUserInfo(data)
          resolve(data)
        }).catch(
          error => {
            reject(error)
          }
        )
      }
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_USER', {
        name: '',
        dept: '',
        mail: '',
        id: '',
        token: '',
        gender: ''
      })
      removeToken()
      resolve()
    })
  },

  // remove token and user info, same to logout
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USER', {
        name: '',
        dept: '',
        mail: '',
        id: '',
        token: '',
        gender: ''
      })
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
*/
