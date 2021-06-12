import App from "./App.vue";

import Vue from "vue";
import elTableAdminPage from "../packages/index";
Vue.use(elTableAdminPage);

new Vue({
  render: h => h(App)
}).$mount("#app");
