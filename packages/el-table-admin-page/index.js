import elTableAdminPage from './src/el-table-admin-page.vue'

elTableAdminPage.install = function(Vue){
    Vue.component(elTableAdminPage.name, elTableAdminPage)
}

export default elTableAdminPage