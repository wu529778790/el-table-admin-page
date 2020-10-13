import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import elTableAdminPage from '../packages/index'
Vue.use(elTableAdminPage)

new Vue({
  render: h => h(App),
}).$mount('#app')
