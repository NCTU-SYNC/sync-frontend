import '@testing-library/jest-dom'

import 'intersection-observer'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import FirebaseAuth from '@/utils/firebase.js'
import SvgIcon from '@/components/SvgIcon'
import '@/assets/scss/main.scss'

Vue.component('icon', SvgIcon)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.prototype.$firebaseAuth = FirebaseAuth
