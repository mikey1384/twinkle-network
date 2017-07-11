import {createStore, combineReducers, applyMiddleware} from 'redux'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import * as reducers from 'redux/reducers'
import ReduxThunk from 'redux-thunk'

export default function createStoreWithHistory(history) {
  const middlewares = [routerMiddleware(history), ReduxThunk]
  return createStore(
    combineReducers({
      ...reducers,
      router: routerReducer
    }),
    applyMiddleware(...middlewares)
  )
}
