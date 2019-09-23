import { createStore, combineReducers } from 'redux';
import * as reducers from 'redux/reducers';

export default function createStoreWithMiddlewares() {
  return createStore(
    combineReducers({
      ...reducers
    })
  );
}
