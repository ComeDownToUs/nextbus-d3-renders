import axios from "axios";

import {
  FETCHING_DATA,
  FETCHED_DATA,
  FETCH_ERROR,
  FETCH_ROUTE_LIVEDATA,
  CLEAR_LIVEDATA,
  UPDATE_INFO_FIELD,
  CLEAR_INFO_FIELD
} from "./constants";

export const updateDataField = tag => {
  if (tag !== null)
    return dispatch => {
      dispatch({
        type: UPDATE_INFO_FIELD,
        info: tag,
        form: "route"
      });
    };
  else
    return dispatch => {
      dispatch({
        type: CLEAR_INFO_FIELD
      });
    };
};

export const getLiveData = route => {
  const agency = "sf-muni";
  const API_URL = `http://webservices.nextbus.com/service/publicJSONFeed?a=${agency}`;

  const routeQuery = route ? `&r=${route}` : "";
  return dispatch => {
    dispatch({ type: FETCHING_DATA });
    axios
      .get(`${API_URL}&command=vehicleLocations&t=0${routeQuery}`)
      .then(response => {
        dispatch({
          type: FETCH_ROUTE_LIVEDATA,
          live: liveDataPoints(response.data)
        });
        dispatch({ type: FETCHED_DATA });
      })
      .catch(error => {
        console.log("ERRRRR");
        console.log(error);
        dispatch({
          type: FETCH_ERROR,
          error: error
        });
        dispatch({ type: FETCHED_DATA });
      });
  };
};

export const clearLiveData = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_LIVEDATA
    });
  };
};

const liveDataPoints = data => {
  if (!data.vehicle) return null;
  const vehicles = Array.isArray(data.vehicle) ? data.vehicle : [data.vehicle];
  const holder = {
    type: "FeatureCollection",
    features: []
  };
  holder.features = vehicles.map(entry => ({
    type: "Feature",
    properties: {
      title: entry.id,
      speed: entry.speedKmHr,
      direction: entry.heading,
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(entry.lon), parseFloat(entry.lat)]
    }
  }));
  return holder;
};

export const isLoading = () => {
  return dispatch => ({
    type: FETCHING_DATA
  });
};
export const hasLoaded = () => {
  return dispatch => ({
    type: FETCHED_DATA
  });
};
