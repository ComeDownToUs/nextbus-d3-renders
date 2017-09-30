import React, { Component } from "react";
import { Link } from "react-router-dom";

import Path from "./path";
import HoverData from "./hoverdata";

// wraps each path with a link
// to allow configurability of map operations
//    e.g. a "select stop" view instead of route

// ISSUES:
// - hover operations currently slow down system drastically
//   (commented out below, replaced with null)
// - component becomes locked as live data is updating

class LinkPath extends Component {
  getDataView(properties) {
    const route = this.props.routes[properties.tag];
    console.log("we in here");
    return (
      <HoverData
        route={route}
        start={this.props.stops[route.stops[0]]}
        end={this.props.stops[route.stops[route.stops.length - 1]]}
      />
    );
  }

  render() {
    const {
      linkDir,
      options,
      dataSet,
      getGeoPath,
      projection,

      //these props refer to the currently disabled hover operations
      updateDataField,
      newPathId,
      setDataView
    } = this.props;

    return (
      <g className={options.outerClass}>
        {dataSet.features.map((d, i) => (
          <Link
            to={`/${linkDir}/${d.properties.tag}`}
            key={`${linkDir}-link-${i}`}
            onMouseEnter={
              null /*
              () => {
                updateDataField(d.properties.tag);
                setDataView(this.getDataView(d.properties));
              }}
              onMouseLeave={() => {
                updateDataField(null);
                setDataView(null);
              }}
              onClickCapture={() => {
                newPathId();
              }}
              */
            }
          >
            <Path
              key={"path" + i}
              data={d}
              options={options}
              getGeoPath={getGeoPath}
              projection={projection}
            />
          </Link>
        ))}
      </g>
    );
  }
}

export default LinkPath;
