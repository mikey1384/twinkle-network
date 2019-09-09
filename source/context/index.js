import React, { createContext } from 'react';
import useRedux from './useRedux';
import PropTypes from 'prop-types';

export const Context = createContext();

ContextProvider.propTypes = {
  children: PropTypes.node
};

export function ContextProvider({ children }) {
  return <Context.Provider value={useRedux()}>{children}</Context.Provider>;
}
