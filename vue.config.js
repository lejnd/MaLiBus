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
                target: 'https://business.mali126.com:448', 
                // target: 'http://test.company.mali666.com:9006',
                changOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            },
        }
    }
}
