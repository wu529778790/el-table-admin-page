import Vue from "vue";
import App from "./App.vue";

import {
  Table,
  TableColumn,
  Button,
  Pagination,
  Select,
  Option,
  Message,
  Input
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.prototype.$message = Message;
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
Vue.component(CollapseTransition.name, CollapseTransition);
import elTableAdminPage from "../packages/index";
Vue.use(elTableAdminPage);

new Vue({
  render: h => h(App)
}).$mount("#app");
