import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ViewActions from './View/actions';
import ViewReducer from './View/reducer';
import { initialViewState } from './initialStates';

export const ViewContext = createContext();

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
