import React, {Component} from "react";
import { push } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { select as d3Select, geoEquirectangular, geoPath } from "d3";
import fs from "fs";

import neighborhoods from "../../sfmap/neighborhoods.json";
import streets from "../../sfmap/streets.json";
import freeways from "../../sfmap/freeways.json";
import stops from "../../sfmap/stops.json";
import routePaths from "../../sfmap/routePaths.json";

class SFMap extends Component {

  constructor(props) {
    super(props);
  }

  render(){
    const dataDir = "../../sfmap/";
    const scale = 1.5;
    const width = 550 * scale;
    const height = 450 * scale;

    function getGeoPath() {
      const equiProjection = geoEquirectangular()
        .scale(190000 * scale)
        .rotate([0, 0])
        .center([-122.434756486329144, 37.747849389243228])
        .translate([width / 2, height / 1.5]);
      return geoPath().projection(equiProjection);
    }

    const defaultD3Options = {
      stroke: "rgba(0,0,0,0.5)",
      strokeWidth: "1",
      fill: "rgba(0,0,0,0.75)",
      outerClass: "classReqd",
      text: false,
      mouseOver: ()=>{},
    };

    function buildPath(dataSet, options) {
      options = {
        ...defaultD3Options,
        ...options
      };
      const gPath = getGeoPath();
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
          {options.text ? d.title : ""}
        </path>
      ));
      return <g className={options.outerClass}>{geo}</g>;
    }

    return (
      <div>
        <svg width={width} height={height}>
          { buildPath(neighborhoods, { fill: "rgba(130,230,180,1", mouseOver: (x) => { console.log(x)} }) }
          { buildPath(freeways, { fill: 'none', stroke: "rgba(130,130,130,1)", strokeWidth:4 } ) }
          { buildPath(streets, { fill: "none" })} 
          { buildPath(stops, { fill: "none", stroke: "none", text: true }) }
          { buildPath(routePaths, { fill: "none", stroke: "none", text: true }) }
        </svg>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  routes: state.counter.routes,
  stops: state.counter.stops
});

export default connect(mapStateToProps, null)(SFMap);
