import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import * as reducers from 'redux/reducers';
import ReduxThunk from 'redux-thunk';

export default function createStoreWithHistory(history) {
  return createStore(
    combineReducers({
      ...reducers
    }),
    compose(applyMiddleware(ReduxThunk))
  );
}
