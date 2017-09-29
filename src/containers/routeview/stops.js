import React from "react";

const StopView = props => (
  <ol>
    {props.stops.map((stop, i) => 
      <li key={`stop-${i}`}>{stop}</li>)
    }
  </ol>
);

export default StopView;
