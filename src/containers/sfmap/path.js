import React from 'react'

const Path = props => {
  const { data, options, getGeoPath, projection } = props
  const gPath = getGeoPath(projection)

  return (
    <path
      d={gPath(data)}
      className={ options.classPrefix }
      stroke={ options.customStroke ? data.properties.color : null}
      onClickCapture={() => {
        options.mouseOver(data.properties);
      }}
    />
  );
}

export default Path
