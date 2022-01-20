import { login, updateProfilePref } from '@/api/user'
import {
  getToken,
  setToken,
  setExpiredTime,
  setUserInfo,
  getUserInfo
} from '@/utils/auth'

/* ! TODO: replace with vuex action [SYNC-154] */
import FirebaseAuthInstance from '@/utils/firebase'

const getDefaultState = () => {
  return {
    isInitialized: false,
    token: getToken(),
    name: '',
    displayName: getUserInfo() ? getUserInfo().displayName : '',
    preferences: getUserInfo()
      ? getUserInfo().preferences
      : {
        isAnonymous: false,
        editedNotification: false,
        subscribedNotification: false
      },
    nameModTime: [],
    email: getUserInfo() ? getUserInfo().email : '',
    uid: getUserInfo() ? getUserInfo().uid : '',
    gender: '',
    photoURL: null,
    authenticated: false,
    createAt: '',
    notifications: []
  }
}

const state = getDefaultState()

const getters = {
  createAt: (state) => state.createAt,
  email: (state) => state.email,
  preferences: (state) => state.preferences,
  nameModTime: (state) => state.nameModTime
}

const mutations = {
  SET_USER(state, user) {
    state.photoURL = user ? user.photoURL : null
    state.displayName = user ? user.displayName : null
    state.email = user ? user.email : null
    state.authenticated = !!user
    state.createAt = user ? user.metadata.a : ''
    state.uid = user ? user.uid : ''
    state.isInitialized = true
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  RESET_USER(state) {
    Object.assign(state, getDefaultState())
  },
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },
  SET_DISPALY_NAME(state, displayName) {
    state.displayName = displayName
    const data = getUserInfo()
    data.displayName = displayName
    setUserInfo(data)
  },
  SET_PREFERENCES(state, preferences) {
    state.preferences = preferences
  },
  SET_NAME_MOD_TIME(state, nameModTime) {
    state.nameModTime = nameModTime
  }
}

const actions = {
  sendToken({ commit, dispatch }, userdata) {
    return new Promise((resolve, reject) => {
      login(userdata)
        .then((response) => {
          const { data } = response
          if (data.data.nameModTime) {
            commit('SET_NAME_MOD_TIME', data.data.nameModTime)
          }
          commit('SET_TOKEN', userdata.idToken)
          setToken(userdata.idToken)
          setExpiredTime(Date.now() + 3 * 24 * 60 * 60 * 1000)
          resolve(data.message)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  sendUserInfo({ commit }, userInfo) {
    commit('SET_USER', userInfo)
    setUserInfo(userInfo)
  },
  removeUser({ commit }) {
    commit('RESET_USER')
  },
  updateDisplayName({ commit }, displayName) {
    commit('SET_DISPALY_NAME', displayName)
    FirebaseAuthInstance.instance.currentUser
      .updateProfile({
        displayName: displayName
      })
      .catch((error) => {
        console.error(error)
      })
  },
  setPreferences({ commit }, preferences) {
    commit('SET_PREFERENCES', preferences)
  },
  updatePreferences({ commit }, preferences) {
    commit('SET_PREFERENCES', preferences)
    FirebaseAuthInstance.instance.currentUser
      .getIdToken()
      .then((token) => {
        updateProfilePref({
          token: token,
          payload: { preferences: preferences }
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
