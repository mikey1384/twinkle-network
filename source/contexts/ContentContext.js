import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ContentActions from './Content/actions';
import ContentReducer from './Content/reducer';
import { initialContentState } from './initialStates';

export const ContentContext = createContext();

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
