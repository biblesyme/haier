const path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeModules = path.resolve(__dirname,'../node_modules');

var extractAntDPlugin = new ExtractTextPlugin({
          filename: '[name]-[hash]-antD.css'
        });
var extractStylePlugin = new ExtractTextPlugin({
  filename: '[name]-[hash]-style.css'
});
function extractAntDLoader(){
    return {
            test: /\.less$/,
            use: [{
                loader: "style-loader?" // creates style nodes from JS strings
                , options: {
                  sourceMap: process.env.NODE_ENV === 'production'? true : false,
                }
            }, {
                loader: "css-loader?!postcss-loader",
                options:{
                  localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
                  importLoaders: 2,
                  "sourceMap": process.env.NODE_ENV === 'production'? true : false,
                }
            }, {
                loader: "less-loader", // compiles Sass to CSS
                options: {
                  paths:[nodeModules,'./src/components'],
                  "sourceMap": process.env.NODE_ENV === 'production'? true : false,
                }
            }]
          };
}

function extractSassLoader(){
  if(process.env.NODE_ENV === 'production'){
    return {
        test: /\.scss|.sass$/,
        use: extractStylePlugin.extract({
          fallback: "style-loader",
          use: [
        //   {
        //     loader: "style-loader" // creates style nodes from JS strings
        //     , options: {
        //       sourceMap: process.env.NODE_ENV === 'production'? true : false,
        //     }
        // },
        {
            loader: "css-loader?!postcss-loader",
            options:{
              modules: true,
              localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              importLoaders: 2,
              "sourceMap": process.env.NODE_ENV === 'production'? true : false,
            }
        }, {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              includePaths:[nodeModules,'./src/components'],
              "sourceMap": process.env.NODE_ENV === 'production'? true : false,
            }
        }]
    })
      };
  }else{
    return {
        test: /\.scss|.sass$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
            , options: {
              sourceMap: process.env.NODE_ENV === 'production'? true : false,
            }
        }, {
            loader: "css-loader?!postcss-loader",
            options:{
              modules: true,
              localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              importLoaders: 2,
              "sourceMap": process.env.NODE_ENV === 'production'? true : false,
            }
        }, {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              includePaths:[nodeModules,'./src/components'],
              "sourceMap": process.env.NODE_ENV === 'production'? true : false,
            }
        }]
      }
  }
}

function extractCssLoader(){
  if(process.env.NODE_ENV === 'production'){
    return {
        test: /\.css$/,
        use: extractStylePlugin.extract({
          fallback: "style-loader",
          use:[
          // {
          //     loader: "style-loader" // creates style nodes from JS strings
          //     , options: {
          //       sourceMap: process.env.NODE_ENV === 'production'? true : false,
          //     }
          // },
          {
              loader: "css-loader?!postcss-loader",
              options:{
                modules: true,
                localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
                "sourceMap": process.env.NODE_ENV === 'production'? true : false,
              }
          }]
      })
      };
  }else{
    return {
        test: /\.css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
            , options: {
              sourceMap: process.env.NODE_ENV === 'production'? true : false,
            }
        }, {
            loader: "css-loader?!postcss-loader",
            options:{
              modules: true,
              localIdentName: '[path]_[name]_[local]_[hash:base64:5]',
              "sourceMap": process.env.NODE_ENV === 'production'? true : false,
            }
        }]
      }
  }
}
module.exports = {
  extractAntDPlugin
  , extractStylePlugin
  , extractAntDLoader
  , extractSassLoader
  , extractCssLoader
}
