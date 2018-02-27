const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var extractPlugins = require('./extractStyleLoader')
var baseConfig = require('./webpack.base.js');

module.exports = Object.assign(baseConfig, {
  entry: {
    bundle :[
      "../src/client.js"
    ]
  },
  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "../dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: "[name]-[hash].js", // string
    // the filename template for entry chunks

    publicPath: "./", // string
    // the url to the output directory resolved relative to the HTML page

    library: "MyLibrary", // string,
    // the name of the exported library

    libraryTarget: "umd", // universal module definition
    // the type of the exported library

  },
  devtool: false,
  plugins: [
    // new webpack.NamedModulesPlugin(),
    // build optimization plugins
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash].min.js',
    }),
    extractPlugins.extractAntDPlugin,
    extractPlugins.extractStylePlugin,
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      },
      mangle: false,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // compile time plugins
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV === 'production'?'"production"':'"development"',
    }),
    new HtmlWebpackPlugin(
        {
          title:'Portal',
          template: '../index.html',
          filename:'index.html',
          // serverRender:{
          //   outPutHtml:'<%-outPutHtml%>'
          // },
          // chunks:['vendor','bundle'],
          // inject: true
        }
      )
  ]
})
