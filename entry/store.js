import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import * as reducers from 'redux/reducers';
import ReduxThunk from 'redux-thunk';
import notifier from './middlewares/notifier';

export default function createStoreWithHistory(history) {
  const middlewares = [routerMiddleware(history), notifier, ReduxThunk];
  return createStore(
    combineReducers({
      ...reducers,
      router: routerReducer
    }),
    applyMiddleware(...middlewares)
  );
}
