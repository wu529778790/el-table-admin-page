import elTableAdminPage from './el-table-admin-page'

const components = [
    elTableAdminPage
]

const install = function (Vue) {
    if (install.installed) return
    components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.vue) {
    install(window.vue)
}

export default {
    install,
    elTableAdminPage
}