import React from 'react'

const HoverData = props => {
  const { route, start, end } = props
  return(
    <div className="infoBox">
      <div>
        <div className="forty">Route</div>
        <div className="sixty">{route.title}</div>
        <div className="forty">Stops</div>
        <div className="sixty">{route.stops.length}</div>
        <div className="forty">Source</div>
        <div className="sixty">
          {start.title}
        </div>
        <div className="forty">Dest.</div>
        <div className="sixty">
          {
            end.title
          }
        </div>
      </div>
    </div>
  )
}

export default HoverData
