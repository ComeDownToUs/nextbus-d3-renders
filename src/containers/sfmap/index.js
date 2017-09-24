import React, {Component} from "react";
import { push, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { select as d3Select, geoEquirectangular, geoPath } from "d3";

import { Origin } from 'redux-tooltip'
import { Tooltip } from 'redux-tooltip'

import neighborhoods from "../../sfmap/neighborhoods.json";
import streets from "../../sfmap/streets.json";
import freeways from "../../sfmap/freeways.json";
import stops from "../../sfmap/stops.json";
import routePaths from "../../sfmap/routePaths.json";

class SFMap extends Component {

  constructor(props) {
    super(props);
    this.createMap = this.createMap.bind(this)
    this.scale = 1;
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
      strokeWidth: "2", 
      fill: "none" 
    })
  }

  componentDidMount() {
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
    const SVGOrigin = Origin.wrapBy('g');
    const gPath = this.getGeoPath();
    const geo = dataSet.features.map((d, i) => {
      const title = <strong>d.properties.title</strong>
      return (
        <Link key={`route-link-${i}`} to={`route/${i}`}>
          <SVGOrigin className="target dom" content={title}>
          <path
            key={"path" + i}
            d={gPath(d)}
            className={`route route-${d.properties.title}`}
            stroke={(options.stroke)? d.properties.color : 'none'}
            strokeWidth={options.strokeWidth}
            fill={options.fill}
            onMouseOver={() => this.mouseoverevent(d)}
          />
          </SVGOrigin>
        </Link>
      )
    });
    return (<g className={options.outerClass}>{geo}
    </g>);
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
      strokeWidth: "6", 
      fill: "none" 
    })
  }


  render(){
    console.log(this)
    const {width, height } = this
    return (
      <div>
      <Tooltip> ToolTesting </Tooltip>
        <svg ref={() => this.node } width={width} height={height} className={(this.props.count % 3 === 0)?'no-routes':''}>
          { this.neighborhoods }
          { this.streets }
          { this.routes }
        </svg>
        {this.mouseoverdata}
      </div>
    );
  }
};

const mapStateToProps = state => ({
  routes: state.counter.routes,
  stops: state.counter.stops,
  count: state.counter.count,
});

export default connect(mapStateToProps, null)(SFMap);
