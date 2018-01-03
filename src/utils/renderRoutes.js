import React from 'react'
import Switch from 'react-router/Switch'
import Route from 'react-router/Route'

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
            if (roles.includes(Store.App.role) || route.path === '/') {
              return <route.component {...props} {...extraProps} route={route}/>
            } else {
              return <img src="http://omph2coqc.bkt.clouddn.com/18-1-3/61763423.jpg" alt=""
                          style={{margin: '100px 100px'}}
                     />
            }
          }
          return <route.component {...props} {...extraProps} route={route}/>
        }}
      />
    ))}
  </Switch>
) : null

export default renderRoutes
