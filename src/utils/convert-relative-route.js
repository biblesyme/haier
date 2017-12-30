export default function relativeRoutes(routes) {
  for (var i = 0; i < routes.length; i++) {
    let route = routes[i]
    if(route.routes){
      for (var j = 0; j < route.routes.length; j++) {
        let childroute = route.routes[j]
        if(!childroute.absolute){
          childroute.path = route.path + childroute.path
          childroute.absolute = true
        }
        if(childroute.routes){
          relativeRoutes([childroute])
        }
      }
    }
  }
}