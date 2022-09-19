import matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import SvgIcon from '@/components/SvgIcon'
import '@/assets/scss/main.scss'

expect.extend(matchers)

Vue.component('SyncIcon', SvgIcon)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
