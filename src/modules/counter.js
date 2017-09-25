import axios from 'axios'

import mapData from '../sfmap'

export const INCREMENT_REQUESTED = 'counter/INCREMENT_REQUESTED'
export const INCREMENT = 'counter/INCREMENT'
export const DECREMENT_REQUESTED = 'counter/DECREMENT_REQUESTED'
export const DECREMENT = 'counter/DECREMENT'

export const FETCHING_DATA = 'map/FETCHING_DATA'
export const FETCH_ERROR = 'map/FETCH_ERROR'
export const FETCH_ALL_LIVEDATA = 'map/FETCH_ALL_LOCATIONS'
export const FETCH_ROUTE_LIVEDATA = 'map/FETCH_ROUTE_LOCATIONS'
export const FETCH_ROUTE = 'map/FETCH_ROUTE_DATA' // including live data
export const FETCH_STOP = 'map/FETCH_STOP_DATA'
export const UPDATE_DATA_FIELD = 'map/UPDATE_DATA_FIELD'

const initialState = {
  count: 0,
  isIncrementing: false,
  isDecrementing: false,
  focusRoute: null,
  focusStop: null,
  hoverItem: 'Hover over a route',
  liveData: null,
  status: 'initialised',
  ...mapData
}



export default (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_REQUESTED:
      return {
        ...state,
        isIncrementing: true
      }
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
        isIncrementing: !state.isIncrementing
      }
    case DECREMENT_REQUESTED:
      return {
        ...state,
        isDecrementing: true
      }
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
        isDecrementing: !state.isDecrementing
      }
    case FETCH_ROUTE_LIVEDATA:
      return {
        ...state,
        liveData: action.live
      }
    case UPDATE_DATA_FIELD:
      return {
        ...state,
        hoverItem: action.info,
      }
    case FETCH_ERROR:
      return {
        ...state,
        status: action.error
      }
    default:
      return state
  }
}

export const updateDataField = (data) => {
  return dispatch => {
    dispatch ({
      type: UPDATE_DATA_FIELD,
      info: data.tag,
    })
  }
}

export const getLiveData = (route) => {
  console.log(route)
  const agency = 'sf-muni'
  const API_URL = `http://webservices.nextbus.com/service/publicJSONFeed?a=${agency}`;
  const routeQuery = (route ? `&r=${route}` : '')
  console.log(`APIREQ ${API_URL}&command=vehicleLocations&t=0${routeQuery}`)
  return dispatch => {
    dispatch({type: FETCHING_DATA})
    axios.get(`${API_URL}&command=vehicleLocations&t=0${routeQuery}`)
      .then( response => {
        dispatch({
          type: FETCH_ROUTE_LIVEDATA,
          live: liveDataPoints(response.data),
        })
      })
      .catch( error => {
        console.log("ERRRRR")
        console.log(error)
        dispatch({
          type: FETCH_ERROR,
          error: error,
        })
      })
  }
}

const liveDataPoints = data => {
  if(!data.vehicle)
    return null
  const holder = {
    type: "FeatureCollection",
    features: []
  }
  holder.features = data.vehicle.map(entry => ({
    type: "Feature",
    properties: {
      title: entry.id,
      speed: entry.speedKmHr,
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(entry.lon), parseFloat(entry.lat)]
    }
  }))
  return holder
}

export const increment = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT_REQUESTED
    })

    dispatch({
      type: INCREMENT
    })
  }
}
export const decrement = () => {
  return dispatch => {
    dispatch({
      type: DECREMENT_REQUESTED
    })

    dispatch({
      type: DECREMENT
    })
  }
}
