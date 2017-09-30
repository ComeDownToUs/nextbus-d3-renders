import React from "react";

const Points = props => {
  const { projection, options, dataSet } = props;

  const geo = dataSet.features.map((d, i) => (
    <a key={`point-${i}`}>
      <circle
        className={
          options.isBus && d.properties.speed > 0
            ? options.classPrefix + "moving"
            : options.classPrefix
        }
        cx={projection(d.geometry.coordinates)[0]}
        cy={projection(d.geometry.coordinates)[1]}
        r={20}
        fill="#E91E63"
        stroke="#FFFFFF"
      />
      <text
        x={projection(d.geometry.coordinates)[0]}
        y={projection(d.geometry.coordinates)[1]}
        fill="red"
      >
        {d.properties.speed}
      </text>
    </a>
  ));

  return <g className={options.outerClass}>{geo}</g>;
};

export default Points;
