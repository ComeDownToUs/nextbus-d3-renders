import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import transport from "./transport";

export default combineReducers({
  routing: routerReducer,
  transport
});
