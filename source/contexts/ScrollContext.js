import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ScrollActions from './Scroll/actions';
import ScrollReducer from './Scroll/reducer';
import { initialScrollState } from './initialStates';

export const ScrollContext = createContext();

ScrollContextProvider.propTypes = {
  children: PropTypes.node
};
export function ScrollContextProvider({ children }) {
  const [scrollState, scrollDispatch] = useReducer(
    ScrollReducer,
    initialScrollState
  );
  return (
    <ScrollContext.Provider
      value={{
        state: scrollState,
        actions: ScrollActions(scrollDispatch)
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}
