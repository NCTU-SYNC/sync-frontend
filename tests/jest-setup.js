import '@testing-library/jest-dom'
import dotenv from 'dotenv'

// load environment variables from .env file
dotenv.config()

import 'intersection-observer'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import SvgIcon from '@/components/SvgIcon'
import '@/assets/scss/main.scss'

Vue.component('icon', SvgIcon)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
