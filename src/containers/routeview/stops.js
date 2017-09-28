import React from 'react'

const StopView = props => (
  <ul>
    {
      props.stops.map( (stop, i) => 
        <li key={`stop-${i}`}>{i} {stop}</li>
      )
    }
  </ul>
)

export default StopView
