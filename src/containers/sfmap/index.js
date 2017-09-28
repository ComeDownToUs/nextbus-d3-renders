import React, { Component } from "react";
import { push, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { geoEquirectangular, geoPath } from "d3";

import HoverData from "./hoverdata";

import {
  getLiveData,
  clearLiveData,
  updateDataField,
  isLoading,
  hasLoaded
} from "../../modules/transport";
import { doNothing } from "../../helpers/placeholders";
import { routeParser } from "../../helpers/routeParser";

import {
  routeOptions,
  neighborhoodOptions,
  streetOptions,
  selectedRouteOptions,
  busOptions
} from "./d3displayoptions";

import neighborhoods from "../../sfmap/neighborhoods.json";
import streets from "../../sfmap/streets.json";
import routePaths from "../../sfmap/routePaths.json";

class SFMap extends Component {
  constructor(props) {
    console.log('constructor')
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
    //building core map operations
    this.neighborhoods = this.buildPath(neighborhoods, neighborhoodOptions);
    this.streets = this.buildPath(streets, streetOptions);
    this.routes = this.buildRoutes(routePaths, routeOptions);
  }
  componentDidMount() { }
  componentWillUpdate() { }
  componentDidUpdate(prevProps, prevState) {
    const oldRouteID = this.path.id;
    this.path = routeParser(this.props.path);
    if (oldRouteID !== this.path.id && this.path.id) {
      console.log('newL')
      this.liveSetup();
    }
  }

  newPathId(){
    this.locationCheck = doNothing
    this.props.clearLiveData()
    console.log('newP')
  }

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

  getGeoPath() {
    const { width, height, scale } = this;
    const equiProjection = geoEquirectangular()
      .scale(190000 * scale)
      .rotate([0, 0])
      .center([-122.434756486329144, 37.747849389243228])
      .translate([width / 2, height / 1.5]);
    return geoPath().projection(equiProjection);
  }

  buildPath(dataSet, options) {
    const gPath = this.getGeoPath();
    const isBus = options.classPrefix.indexOf("bus") !== -1 ? true : false;
    const geo = dataSet.features.map((d, i) => (
      <path
        key={"path" + i}
        d={gPath(d)}
        className={
          isBus && d.properties.speed > 0
            ? options.classPrefix + "moving"
            : options.classPrefix + d.properties[options.keyID]
        }
        stroke={options.stroke}
        strokeWidth={options.strokeWidth}
        fill={options.fill}
        onClickCapture={() => {
          options.mouseOver(d.properties);
        }}
      />
    ));
    return <g className={options.outerClass}>{geo}</g>;
  }

  buildRoutes(dataSet, options) {
    this.props.isLoading();
    const gPath = this.getGeoPath();
    const geo = dataSet.features.map((d, i) => (
      <Link key={`route-link-${i}`} to={`/route/${d.properties.tag}`} >
        <path
          key={"path" + i}
          d={gPath(d)}
          className={`route route-${d.properties.title}`}
          stroke={options.stroke ? d.properties.color : "none"}
          strokeWidth={options.strokeWidth}
          fill={options.fill}
          onMouseEnter={() => {
            this.props.updateDataField(d.properties.tag);
            this.dataView = this.getDataView(d.properties);
          }}
          onMouseLeave={() => {
            this.props.updateDataField(null);
            this.dataView = null;
          }}
          onClick={() => {
            this.newPathId()
          }}
        />
      </Link>
    ));
    return <g className={options.outerClass}>{geo}</g>;
  }

  getDataView(properties) {
    const route = this.props.routes[properties.tag];
    return (
      <HoverData
        route={route}
        start={this.props.stops[route.stops[0]]}
        end={this.props.stops[route.stops[route.stops.length - 1]]}
      />
    );
  }

  render() {
    const { width, height } = this;
    return (
      <div>
        <svg
          preserveAspectRatio="xMinYMin meet"
          viewBox={"0 0 " + width + " " + height}
          className={this.props.count % 3 === 0 ? "no-routes" : ""}
        >
          {this.neighborhoods}
          {this.streets}
          {this.routes}
          {this.path.id
            ? this.buildRoutes({
                  features: routePaths.features.filter(
                    r => r.properties.tag === this.path.id
                  )
                }, selectedRouteOptions
              )
            : null}
          {this.props.liveData !== null && this.path.id
            ? this.buildPath(this.props.liveData, busOptions)
            : null}
        </svg>

        {this.props.isFetching ? "Loading..." : ""}

        {this.dataView ? this.dataView : null}
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
