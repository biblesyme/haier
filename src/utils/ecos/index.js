Object.defineProperty(exports, "__esModule", {
  value: true
});
import ecos from './src'
let app = ecos({})
exports.default = app;
exports.connect = require('./src/connect')(app);