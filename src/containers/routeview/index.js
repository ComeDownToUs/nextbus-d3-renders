import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";

import StopsDisplay from "./stops";

import { routeParser as urlParser } from "../../helpers/routeParser";

import "../../styles/route.css";

const RouteView = props => {
  const urlData = urlParser(props.pathname);
  if (Object.keys(props.routes).indexOf(urlData.id) === -1) {
    props.fourOhFour();
    return <div>Error has occurred, redirecting...</div>;
  }
  const routeData = props.routes[urlData.id];
  const routeStops = routeData.stops.map(stopID => props.stops[stopID].title);
  return (
    <div className="route-view">
      <h1>{routeData.title}</h1>
      <div className="stops">
        <h2>Stops</h2>
        <div className="stops-list">
          <StopsDisplay stops={routeStops} />
        </div>
      </div>
      <div className="route-info">
        Further route info goes in here (e.g. status of stations, predictions,
        number of active buses)
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  stops: state.transport.stops,
  routes: state.transport.routes,
  pathname: state.routing.location.pathname
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fourOhFour: () => push("/404")
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RouteView);
