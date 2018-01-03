Object.defineProperty(exports, "__esModule", {
  value: true
});
import React from 'react'
import ecos from './utils/ecos'
import ReactDOM from 'react-dom';
import {Switch,Route} from 'react-router-dom'

import { ConnectedRouter } from 'react-router-redux'

import renderRoutes from 'react-router-config/renderRoutes'

import convertRelativeRoute from './utils/convert-relative-route'

const routes = require('./index')

convertRelativeRoute(routes)

const Routers = function ({ history, app }) {
  return (
    <ConnectedRouter history={history}>
      {renderRoutes(routes,{app})}
    </ConnectedRouter>
    )
}

// 3. Router
ecos.router(Routers)

// 4. Start
const Ecos = ecos.start('#app')

if(process.env.NODE_ENV !== 'production'){
  window.ecos = ecos;
}
exports.default = Ecos
exports.createStoreProvider = ecos.createStoreProvider