import React from 'react'
import ecos from './utils/ecos'
import ReactDOM from 'react-dom';

import {Switch,Route} from 'react-router-dom'

import { ConnectedRouter } from 'react-router-redux'

import renderRoutes from './utils/react-router-config/renderRoutes'

const routes = require('./index')
console.log(routes)
let relativeRoutes = function(routes){
  for (var i = 0; i < routes.length; i++) {
    let route = routes[i]
    if(route.routes){
      for (var j = 0; j < route.routes.length; j++) {
        let childroute = route.routes[j]
        childroute.path = route.path + childroute.path
        if(childroute.routes){
          relativeRoutes(childroute.routes)
        }
      }
    }
  }
}
relativeRoutes(routes)

const Routers = function ({ history, app }) {
    return (
      <ConnectedRouter history={history}>
        {renderRoutes(routes,{app})}
      </ConnectedRouter>
      )
}

// // 2. Model
// app.model(require('./models/app'))

// 3. Router
ecos.router(Routers)

// 4. Start
const Ecos = ecos.start('#app')

let container = document.getElementById('app')

// ReactDOM.render(
//       <Ecos></Ecos>,
//       container
//     );

export default Ecos