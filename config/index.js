'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8100, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    proxyTable: {
      '/huitongyi': {
        // target: 'http://192.168.0.127:8082',
        // target:'http://192.168.0.101:8100',
        // target: 'http://47.99.192.119:8100',
        // target:'http://weachat.htyvip.com/',
        target:'https://weachat.htyvip.com/',
        // target:'http://120.55.95.100:8100',

        changeOrigin: true,
        secure: true,
        pathRewrite: {
          ['^/' + process.env.BASE_API]: ''
        }
      },
      // '/open': {
      //   target:'https://res.wx.qq.com/open/js/jweixin-1.3.0.js'
      // }
    },


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../spring/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../spring'),
    assetsSubDirectory: 'autumnstatic',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
