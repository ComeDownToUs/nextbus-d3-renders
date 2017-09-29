import mapData from "../../data";

import {
  FETCHING_DATA,
  FETCHED_DATA,
  FETCH_ERROR,
  FETCH_ROUTE_LIVEDATA,
  CLEAR_LIVEDATA,
  UPDATE_INFO_FIELD,
  CLEAR_INFO_FIELD
} from "./constants";

const initialState = {
  count: 0,
  focusRoute: null,
  focusStop: null,
  hoverItem: null,
  liveData: null,
  status: "initialised",
  isLoading: true,
  ...mapData
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ROUTE_LIVEDATA:
      return {
        ...state,
        liveData: action.live
      };
    case CLEAR_LIVEDATA:
      return {
        ...state,
        liveData: null
      };
    case UPDATE_INFO_FIELD:
      return {
        ...state,
        hoverItem: {
          tag: action.info,
          form: action.form
        }
      };
    case CLEAR_INFO_FIELD:
      return {
        ...state,
        hoverItem: null
      };
    case FETCHING_DATA:
      return {
        ...state,
        isFetching: true
      };
    case FETCHED_DATA:
      return {
        ...state,
        isFetching: false
      };
    case FETCH_ERROR:
      return {
        ...state,
        status: action.error
      };
    default:
      return state;
  }
};
