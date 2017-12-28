import React from 'react'
import {Switch,Route} from 'react-router-dom'

const renderRoutes = (routes,parentAction,  switchProps = {}) => routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route key={i} path={route.path} exact={route.exact} strict={route.strict} render={(props) => (
        <route.component {...props} parentAction={parentAction} route={route}/>
      )}/>
    ))}
  </Switch>
) : null

export default renderRoutes