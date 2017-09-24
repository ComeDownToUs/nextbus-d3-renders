import React, {Component} from "react";
import { push, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { select as d3Select, geoEquirectangular, geoPath } from "d3";

import { getLiveData, updateDataField } from '../../modules/counter'

import neighborhoods from "../../sfmap/neighborhoods.json";
import streets from "../../sfmap/streets.json";
import freeways from "../../sfmap/freeways.json";
import stops from "../../sfmap/stops.json";
import routePaths from "../../sfmap/routePaths.json";

class SFMap extends Component {

  constructor(props) {
    super(props);
    this.createMap = this.createMap.bind(this)
    this.scale = 6;
    this.width = 550 * this.scale;
    this.height = 450 * this.scale;
    this.dataView = 'No Item Selected'
    this.defaultD3Options = {
      classPrefix: 'd3 ',
      stroke: "rgba(0,0,0,0.4)",
      strokeWidth: "1",
      fill: "none",
      outerClass: "classReqd",
      text: false,
      mouseOver: ()=>{},
    };
    this.mouseoverdata = 'loading'
    this.props.getLiveData()
  }

  componentWillMount() {
    this.neighborhoods = this.buildPath(neighborhoods, { 
        classPrefix: 'neighborhood neigh-', 
        stroke: "rgba(0,0,0,1)", 
        strokeWidth: "0", 
        fill: "rgba(200,255,200,1)" 
      })
    this.streets = this.buildPath(streets)
    this.routes = this.buildRoutes(routePaths, { 
      classPrefix: 'route route-', 
      strokeWidth: "6", 
      fill: "none" 
    })
  }

  componentDidMount() {
    console.log(this.props.path)
    // const {width, height, createMap} = this
    // this.svg = d3Select(this.node)
    //   // .attr('width', width)
    //   // .attr('height', height)
    //   .style('background-color', '#aaaaff')
    //   .attr("preserveAspectRatio", "xMinYMin meet")
    //   .attr("viewBox", "0 0 "+width+" "+height)
    //   .attr('fill', '#ccccff');
  }
  componentDidUpdate() {
    this.createMap()
  }


  getGeoPath() {
    const {width, height, scale} = this
    const equiProjection = geoEquirectangular()
      .scale(190000 * scale)
      .rotate([0, 0])
      .center([-122.434756486329144, 37.747849389243228])
      .translate([width / 2, height / 1.5]);
    return geoPath().projection(equiProjection);
  }

  buildPath(dataSet, options) {
    options = {
      ...this.defaultD3Options,
      ...options
    };
    const gPath = this.getGeoPath();
    const geo = dataSet.features.map((d, i) => (
      <path
        key={"path" + i}
        d={gPath(d)}
        className={d.properties.neighborho}
        stroke={options.stroke}
        strokeWidth={options.strokeWidth}
        fill={options.fill}
        onClickCapture={() => { options.mouseOver(d.properties) }}
      >
      </path>
    ));
    return <g className={options.outerClass}>{geo}</g>;
  }

  buildRoutes(dataSet, options){
    options = {
      ...this.defaultD3Options,
      ...options
    };
    const gPath = this.getGeoPath();
    const geo = dataSet.features.map((d, i) => (
      <Link key={`route-link-${i}`} to={`/route/${i}`}>
        <path
          key={"path" + i}
          d={gPath(d)}
          className={`route route-${d.properties.title}`}
          stroke={(options.stroke)? d.properties.color : 'none'}
          strokeWidth={options.strokeWidth}
          fill={options.fill}
          onMouseEnter={() => {
            this.props.updateDataField(d.properties)
            this.dataView = this.getDataView(d.properties)
          }}
        >
        </path>
      </Link>
    ));
    return <g className={options.outerClass}>{geo}</g>;
  }


  getDataView(properties){
    const routeData1 = this.props.routes[properties.tag]
    return (
      <div>
        <div className="forty">Route</div>
        <div className="sixty">{routeData1.title}</div>
        <div className="forty">Stops</div>
        <div className="sixty">{routeData1.stops.length}</div>
        <div className="forty">Source</div>
        <div className="sixty">{this.props.stops[routeData1.stops[0]].title}</div>
        <div className="forty">Dest.</div>
        <div className="sixty">{this.props.stops[routeData1.stops[routeData1.stops.length - 1]].title}</div>
      </div>
    )
  }


  mouseoverevent(value){
  }


  createMap(){
    this.buildPath(neighborhoods, { 
      classPrefix: 'neighborhood neigh-', 
      stroke: "rgba(0,0,0,1)", 
      strokeWidth: "0", 
      fill: "rgba(200,255,200,1)" 
    })
    this.buildPath(streets)
    this.buildPath(routePaths, { 
      classPrefix: 'route route-', 
      stroke: "rgba(100,100,100,0.3)", 
      strokeWidth: "12", 
      fill: "none" 
    })
  }


  render(){
    console.log(this)
    const {width, height } = this
    let routeData1 = this.props.routes[this.props.info]
    return (
      <div>
        <svg 
          ref={() => this.node } 
          preserveAspectRatio="xMinYMin meet"
          viewBox={"0 0 "+width+" "+height}
          className={(this.props.count % 3 === 0)?'no-routes':''}
          >
          { this.neighborhoods }
          { this.streets }
          { this.routes }
        </svg>
        <div className="infoBox">
          { this.dataView }
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  routes: state.counter.routes,
  stops: state.counter.stops,
  count: state.counter.count,
  path: state.routing.location.pathname,
  info: state.counter.hoverItem,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLiveData,
  updateDataField
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SFMap);
