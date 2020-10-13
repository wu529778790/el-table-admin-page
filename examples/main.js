import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import elTablePage from '../packages/index'
Vue.use(elTablePage)

new Vue({
  render: h => h(App),
}).$mount('#app')
