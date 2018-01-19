const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var projectRoot = path.resolve(__dirname, '../src');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var nodeModules = path.resolve(__dirname,'../node_modules');
var subPublicPath = 'static';
var extractPlugins = require('./extractStyleLoader');

module.exports = {
  // click on the name of the option to get to the detailed documentation
  // click on the items with arrows to show more examples / advanced options

  entry: {
    bundle :[
      'react-hot-loader/patch',
      hotMiddlewareScript,
      // activate HMR for React
      'webpack/hot/only-dev-server',
      "../src/client.js"
    ]
  }, // string | object | array
  // Here the application starts executing
  // and webpack starts bundling

  output: {
    // options related to how webpack emits results

    path: path.resolve(__dirname, "../dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: "[name].js", // string
    // the filename template for entry chunks

    publicPath: "/", // string
    // the url to the output directory resolved relative to the HTML page

    library: "MyLibrary", // string,
    // the name of the exported library

    libraryTarget: "umd", // universal module definition
    // the type of the exported library

  },

  module: {
    // configuration regarding modules

    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        test: /\.js|jsx?$/,
        include: [
          projectRoot
        ],
        exclude: [
          /node_modules/
        ],
        // flags to apply these rules, even if they are overridden (advanced option)

        use:[
          {
            loader: "babel-loader"
          }
        ],
      },
      extractPlugins.extractCssLoader(),
      extractPlugins.extractSassLoader(),
      extractPlugins.extractAntDLoader(),
    ],

    /* Advanced module configuration (click to show) */
  },

  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)

    modules: [
      "node_modules",
      projectRoot
    ],
    // directories where to look for modules

    extensions: [".js", ".json", ".jsx", ".css", ".sass",".less"],
    // extensions that are used

    alias: {
      main: '../src/main.js',
      '@': path.join(__dirname, '..', 'src')
    },
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: "source-map", // enum
  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.

  context: projectRoot, // string (absolute path!)
  // the home directory for webpack
  // the entry and module.rules.loader option
  //   is resolved relative to this directory

  target: "web", // enum
  // the environment in which the bundle should run
  // changes chunk loading behavior and available modules

  stats: "errors-only",
  // lets you precisely control what bundle information gets displayed

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // compile time plugins
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV === 'production'?'"production"':'"development"',
    }),
    // webpack-dev-server enhancement plugins
    new DashboardPlugin(),
    new HtmlWebpackPlugin(
        {
          title:'Portal',
          template: '../index.html',
          filename:'index.html',
          // serverRender:{
          //   outPutHtml:'<%-outPutHtml%>'
          // },
          // chunks:['vendor','bundle'],
          inject: true
        }
      )
  ],
  // list of additional plugins
}
