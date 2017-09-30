import React from 'react'

import Path from './path'

const Paths = props => {
  const { options, dataSet, getGeoPath, projection } = props
  return (
    <g className={options.outerClass}>
      {
        dataSet.features.map((d, i) =>
          <Path 
            key={"path" + i}
            data={d}
            options={options} 
            getGeoPath={getGeoPath} 
            projection={projection}
          />
        )
      }
    </g>
  );
}

export default Paths
