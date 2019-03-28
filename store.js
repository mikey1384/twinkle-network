import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import * as reducers from 'redux/reducers';
import ReduxThunk from 'redux-thunk';

export default function createStoreWithMiddlewares() {
  return createStore(
    combineReducers({
      ...reducers
    }),
    compose(applyMiddleware(ReduxThunk))
  );
}
