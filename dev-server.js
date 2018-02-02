var express = require("express");
const path = require('path');
var httpProxy = require("http-proxy");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack/webpack.base.js");

var app = express();
var compiler = webpack(webpackConfig);

var backendIP=process.env.BACKEND_IP ? process.env.BACKEND_IP : '120.79.157.233'
var backendPort=process.env.BACKEND_PORT ? process.env.BACKEND_PORT: '60080'

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

var apiProxy = httpProxy.createProxyServer();
// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)


// serve pure static assets
app.use('/static', express.static('./static'))


app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  },
  hot: true
}));

 // Proxy api requests
app.use("/v1", function(req, res) {
  req.url = req.originalUrl;
  console.log('proxy: ',req.url);
  apiProxy.proxyRequest(req, res, {
    target: {
      port: parseInt(backendPort),
      host: backendIP
    }
  });
});
app.use('*', function (req, res, next) {
  var filename = path.join(compiler.outputPath,'index.html');
  compiler.outputFileSystem.readFile(filename, function(err, result){
    if (err) {
      return next(err);
    }
    res.set('content-type','text/html');
    res.send(result);
    res.end();
  });
});

app.listen(3000, function () {
  console.log("Listening on port 3000!");
});
