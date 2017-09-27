import React from 'react'

const StopView = props => (
  <div>
    <ul>
      {
        props.stops.map( (stop, i) => 
          <div key={`stop-${i}`}>{i} {stop}</div>
        )
      }
    </ul>
  </div>
)

export default StopView
