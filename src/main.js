import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/app'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Support old IE
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'intersection-observer'

import router from './router'

import { firebaseConfig } from '../config/firebaseConfig'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  render: h => h(App)
}).$mount('#app')
