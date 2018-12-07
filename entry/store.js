import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import * as reducers from 'redux/reducers';
import ReduxThunk from 'redux-thunk';

export default function createStoreWithHistory(history) {
  const middlewares = [routerMiddleware(history), ReduxThunk];
  return createStore(
    combineReducers({
      router: connectRouter(history),
      ...reducers
    }),
    applyMiddleware(...middlewares)
  );
}
