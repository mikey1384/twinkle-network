import React, { createContext } from 'react';
import useStore from './useStore';
import PropTypes from 'prop-types';

export const Context = createContext();

ContextProvider.propTypes = {
  children: PropTypes.node
};

export function ContextProvider({ children }) {
  return <Context.Provider value={useStore()}>{children}</Context.Provider>;
}
