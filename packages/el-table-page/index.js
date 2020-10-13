import elTablePage from './src/el-table-page.vue'

elTablePage.install = function(Vue){
    Vue.component(elTablePage.name, elTablePage)
}

export default elTablePage