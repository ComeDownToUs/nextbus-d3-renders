import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { geoEquirectangular, geoPath } from "d3";

import Paths from "./paths";
import LinkPaths from "./linkpaths";
import Points from "./points";

import {
  getLiveData,
  clearLiveData,
  updateDataField,
  isLoading,
  hasLoaded
} from "../../reducers/transport/actions";

import { doNothing } from "../../helpers/placeholders";
import { routeParser } from "../../helpers/routeParser";

import {
  routeOptions,
  neighborhoodOptions,
  streetOptions,
  selectedRouteOptions,
  busOptions
} from "./d3displayoptions";

import neighborhoods from "../../data/geojson/neighborhoods.json";
import streets from "../../data/geojson/streets.json";
import routePaths from "../../data/geojson/routePaths.json";

import "../../styles/map.css";

class SFMap extends Component {
  constructor(props) {
    console.log("constructor");
    super(props);

    this.path = routeParser(this.props.path);

    // map layout controls
    this.scale = 6;
    this.width = 550 * this.scale;
    this.height = 450 * this.scale;

    // live location tracker
    this.locationCheck = doNothing;
    this.interval = setInterval(() => {
      this.locationCheck();
    }, 10000);
    this.liveView = false;
    this.liveSetup();
  }
  componentWillMount() {
    //building core map operations on mount so they don't redundantly rerender
    this.neighborhoods = this.buildPaths(neighborhoods, neighborhoodOptions);
    this.streets = this.buildPaths(streets, streetOptions);
    this.routes = this.buildRoutes(routePaths, routeOptions);
  }
  componentDidUpdate(prevProps, prevState) {
    const oldRouteID = this.path.id;
    this.path = routeParser(this.props.path);
    if (oldRouteID !== this.path.id && this.path.id) {
      this.liveSetup();
    }
  }

  // prevents UI confusion by clearing data relevant to old page
  newPathId() {
    this.locationCheck = doNothing;
    this.props.clearLiveData();
  }

  // updates the interval operations
  liveSetup() {
    if (this.path.id) {
      this.props.getLiveData(this.path.id);
      this.locationCheck = () => {
        this.props.getLiveData(this.path.id);
      };
      this.liveView = true;
    } else {
      this.props.clearLiveData();
      this.locationCheck = doNothing;
      this.liveView = false;
    }
  }

  // D3 related operations
  // child components are naive to projection matters
  projection() {
    const { width, height, scale } = this;
    return geoEquirectangular()
      .scale(190000 * scale)
      .translate([width / 2, height / 1.5])
      .center([-122.434756486329144, 37.747849389243228])
      .rotate([0, 0]);
  }
  getGeoPath(projection) {
    return geoPath().projection(projection);
  }
  buildPaths(dataSet, options) {
    return (
      <Paths
        dataSet={dataSet}
        options={options}
        projection={this.projection()}
        getGeoPath={this.getGeoPath}
      />
    );
  }
  buildPoints(dataSet, options) {
    this.props.isLoading();
    return (
      <Points
        dataSet={dataSet}
        options={options}
        projection={this.projection()}
      />
    );
  }
  buildRoutes(dataSet, options) {
    this.props.isLoading();
    return (
      <LinkPaths
        dataSet={dataSet}
        options={options}
        projection={this.projection()}
        getGeoPath={this.getGeoPath}
        linkDir={"route"}
        updateDataField={this.props.updateDataField}
        routes={this.props.routes}
        stops={this.props.stops}
        setDataView={this.setDataView.bind(this)}
        newPathId={this.newPathId.bind(this)}
      />
    );
  }
  buildFocusRoute(dataSet, options) {
    const focusRoute = {
      features: dataSet.features.filter((route) => // <--- Hacky
        route.properties.tag === this.path.id)
    };
    return this.buildRoutes(focusRoute, options);
  }

  // updates the popup on hovering over a route
  setDataView(value) {
    this.dataView = value;
  }

  render() {
    const { width, height } = this;
    return (
      <div>
        {this.props.isFetching ? "Loading..." : "some geo status stuff goes here"}
        {/* Map adjusts to screen size currently, should pan and zoom */}
        <svg
          preserveAspectRatio="xMinYMin meet"
          viewBox={"0 0 " + width + " " + height * 2}
          className={this.props.count % 3 === 0 ? "no-routes" : ""}
        >
          {this.neighborhoods}
          {this.streets}
          {this.routes}
          {this.path.id
            ? this.buildFocusRoute(routePaths, selectedRouteOptions)
            : null}
          {this.props.liveData !== null && this.path.id
            ? this.buildPoints(this.props.liveData, busOptions)
            : null}
        </svg>
        { 
          // To be passed up from child components, this dynamically accommodates
          // various styles depending on what needs to be pushed out of the SVG confines
          this.dataView ? this.dataView : null 
        } 
      </div>
    );
  }
}

const mapStateToProps = state => ({
  routes: state.transport.routes,
  stops: state.transport.stops,
  count: state.transport.count,
  path: state.routing.location.pathname,
  info: state.transport.hoverItem,
  liveData: state.transport.liveData,
  isFetching: state.transport.isFetching
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getLiveData,
      clearLiveData,
      updateDataField,
      isLoading,
      hasLoaded
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SFMap);
