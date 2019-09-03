import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const Context = createContext();

const initialSubjectState = {};
function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case 'ENTER_TEXT':
      return {
        ...state,
        [action.contentId]: action.text
      };
    default:
      return state;
  }
}

ContextProvider.propTypes = {
  children: PropTypes.node
};

export function ContextProvider({ children }) {
  const [subjectState, subjectDispatch] = useReducer(
    reducer,
    initialSubjectState
  );
  const value = { subject: { state: subjectState, dispatch: subjectDispatch } };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
