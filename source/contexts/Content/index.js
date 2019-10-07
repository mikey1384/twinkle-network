import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ContentActions from './actions';
import ContentReducer from './reducer';

export const ContentContext = createContext();
export const initialContentState = {};

ContentContextProvider.propTypes = {
  children: PropTypes.node
};
export function ContentContextProvider({ children }) {
  const [contentState, contentDispatch] = useReducer(
    ContentReducer,
    initialContentState
  );
  return (
    <ContentContext.Provider
      value={{
        state: contentState,
        actions: ContentActions(contentDispatch)
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
