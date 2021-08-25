const path = require('path')

module.exports = {
    publicPath: './',
    assetsDir: './',
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        }
    },
    css: { extract: true },
    chainWebpack: config => {
        config.module
            .rule('js')
            .include
            .add(path.resolve(__dirname, 'packages'))
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options
            })
    }
}