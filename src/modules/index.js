import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as tooltip } from 'redux-tooltip'
import counter from './counter'

export default combineReducers({
  routing: routerReducer,
  counter,
  tooltip,
})

