import React from 'react'
import Switch from 'react-router/Switch'
import Route from 'react-router/Route'
import Exception from './Exception'

const renderRoutes = (routes, extraProps = {}, switchProps = {}) => routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={(props) => {
          if (extraProps.hasOwnProperty('app')) {
            let Store = extraProps.app._store.getState()
            let roles = route.role || []
            if (roles.includes(Store.App.role)) {
              return <route.component {...props} {...extraProps} route={route}/>
            } else {
              return <Exception></Exception>
            }
          }
          return <route.component {...props} {...extraProps} route={route}/>
        }}
      />
    ))}
  </Switch>
) : null

export default renderRoutes
