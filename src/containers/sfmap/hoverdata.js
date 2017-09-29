import React from "react";

import "../../styles/hoverdata.css";

const HoverData = props => {
  const { route, start, end } = props;
  return (
    <div className="infoBox">
      <div className="thirty">Route</div>
      <div className="seventy">{route.title}</div>
      <div className="thirty">Stops</div>
      <div className="seventy">{route.stops.length}</div>
      <div className="thirty">Source</div>
      <div className="seventy">{start.title}</div>
      <div className="thirty">Dest.</div>
      <div className="seventy">{end.title}</div>
    </div>
  );
};

export default HoverData;
