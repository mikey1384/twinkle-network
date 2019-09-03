import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const Context = createContext();

const initialState = {
  text: ''
};
function reducer(state, action) {
  switch (action.type) {
    case 'ENTER_TEXT':
      return { ...state, text: action.text };
    default:
      return state;
  }
}

ContextProvider.propTypes = {
  children: PropTypes.node
};

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
