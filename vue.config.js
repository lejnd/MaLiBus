const debug = process.env.NODE_ENV !== 'production'

console.log('debug:', debug)

module.exports = {
    // publicPath: '../addons/ewei_shopv2/static/vue_pay/',
    publicPath: '/',
    // filenameHashing: false,
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                ws: false,
                // target: 'https://butest.mali126.com/', 
                target: 'http://121.40.96.18:8099/',     // test,
                changOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            },
        }
    }
}
