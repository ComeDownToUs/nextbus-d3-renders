import React from "react";
import { connect } from "react-redux";

import StopsDisplay from './stops'

const getRouteID = pathname => {
  const splat = pathname.split(/(\?|#|\/)/)
  if(splat[2].toLowerCase() === 'route')
    return splat[4]
  else
    return false //rediret to 404
}

const getRouteStops = (routeData, stopData) => {
  const filteredStops = [...new Set(routeData.stops)]
  const stops = filteredStops.map(stopID => 
    stopData[stopID].title
  )
  return stops
}

const RouteView = props => {
  const routeID = getRouteID(props.pathname)
  if(!routeID){
    return (<div> 404 </div>)
  }
  const routeData = props.routes[routeID]
  const routeStops = getRouteStops(routeData, props.stops)
  return(
    <div>
      {routeData.title}
      <StopsDisplay stops={routeStops} />
    </div>
  )
}

const mapStateToProps = state => ({
  stops: state.transport.stops,
  routes: state.transport.routes,
  pathname: state.routing.location.pathname,
})

export default connect(mapStateToProps, null)(RouteView)
