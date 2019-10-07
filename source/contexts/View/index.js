import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ViewActions from './actions';
import ViewReducer from './reducer';

export const ViewContext = createContext();
const initialViewState = {
  pageVisible: true,
  exploreCategory: 'subjects',
  explorePath: '',
  exploreSubNav: '',
  profileNav: '',
  homeNav: '/',
  scrollPositions: {}
};

ViewContextProvider.propTypes = {
  children: PropTypes.node
};
export function ViewContextProvider({ children }) {
  const [viewState, viewDispatch] = useReducer(ViewReducer, initialViewState);
  return (
    <ViewContext.Provider
      value={{
        state: viewState,
        actions: ViewActions(viewDispatch)
      }}
    >
      {children}
    </ViewContext.Provider>
  );
}
