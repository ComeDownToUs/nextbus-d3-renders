import React from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const getRouteID = pathname => {
  const splat = pathname.split(/(\?|#|\/)/)
  console.log(splat)
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
  console.log(routeID)
  if(!routeID){
    return (<div> 404 </div>)
  }
  const routeData = props.routes[routeID]
  const routeStops = getRouteStops(routeData, props.stops)
  return(
    <div>
      {routeData.title}
      {
        routeStops.map( (stop, i) => <div key={`stop-${i}`}>{i} {stop}</div>)
      }
    </div>
  )
}

const mapStateToProps = state => ({
  stops: state.counter.stops,
  routes: state.counter.routes,
  pathname: state.routing.location.pathname,
})

export default connect(mapStateToProps, null)(RouteView)
