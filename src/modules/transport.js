import axios from 'axios'

import mapData from '../sfmap'

export const INCREMENT = 'counter/INCREMENT'
export const DECREMENT = 'counter/DECREMENT'

export const FETCHING_DATA = 'map/FETCHING_DATA'
export const FETCHED_DATA = 'map/FETCHED_DATA'
export const FETCH_ERROR = 'map/FETCH_ERROR'
export const FETCH_ALL_LIVEDATA = 'map/FETCH_ALL_LOCATIONS'
export const FETCH_ROUTE_LIVEDATA = 'map/FETCH_ROUTE_LOCATIONS'
export const CLEAR_LIVEDATA = 'map/CLEAR_LIVEDATA'
export const UPDATE_INFO_FIELD = 'map/UPDATE_INFO_FIELD'
export const CLEAR_INFO_FIELD = 'map/CLEAR_INFO_FIELD'

const initialState = {
  count: 0,
  focusRoute: null,
  focusStop: null,
  hoverItem: null,
  liveData: null,
  status: 'initialised',
  isLoading: true,
  ...mapData
}


export default (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      }
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      }
    case FETCH_ROUTE_LIVEDATA:
      return {
        ...state,
        liveData: action.live,
      }
    case CLEAR_LIVEDATA:
      return {
        ...state,
        liveData: null,
      }
    case UPDATE_INFO_FIELD:
      return {
        ...state,
        hoverItem: {
          tag: action.info,
          form: action.form,
        },
      }
    case CLEAR_INFO_FIELD:
      return {
        ...state,
        hoverItem: null,
      }
    case FETCHING_DATA:
      return {
        ...state,
        isFetching: true,
      }
    case FETCHED_DATA:
      return {
        ...state,
        isFetching: false,
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

export const updateDataField = (tag) => {
  if (tag !== null)
    return dispatch => {
      dispatch ({
        type: UPDATE_INFO_FIELD,
        info: tag,
        form: 'route',
      })
    }
  else
    return dispatch => {
      dispatch ({
        type: CLEAR_INFO_FIELD,
      })
    }
}

export const getLiveData = (route) => {
  const agency = 'sf-muni'
  const API_URL = `http://webservices.nextbus.com/service/publicJSONFeed?a=${agency}`;

  const routeQuery = (route ? `&r=${route}` : '')
  return dispatch => {
    dispatch({type: FETCHING_DATA})
    axios.get(`${API_URL}&command=vehicleLocations&t=0${routeQuery}`)
      .then( response => {
        dispatch({
          type: FETCH_ROUTE_LIVEDATA,
          live: liveDataPoints(response.data),
        })
        dispatch({type: FETCHED_DATA})
      })
      .catch( error => {
        console.log("ERRRRR")
        console.log(error)
        dispatch({
          type: FETCH_ERROR,
          error: error,
        })
        dispatch({type: FETCHED_DATA})
      })
  }
}

export const clearLiveData = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_LIVEDATA,
    })
  }
}

const liveDataPoints = data => {
  if(!data.vehicle)
    return null
  const vehicles = Array.isArray(data.vehicle) ? data.vehicle : [data.vehicle]
  const holder = {
    type: "FeatureCollection",
    features: []
  }
  holder.features = vehicles.map(entry => ({
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

export const isLoading = () => {
  return dispatch => ({
    type: FETCHING_DATA,
  })
}
export const hasLoaded = () => {
  return dispatch => ({
    type: FETCHED_DATA,
  })
}

export const increment = () => {
  return dispatch => {
    dispatch({
      type: INCREMENT
    })
  }
}
export const decrement = () => {
  return dispatch => {
    dispatch({
      type: DECREMENT
    })
  }
}
