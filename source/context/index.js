import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const Context = createContext();

const initialNavbarState = {
  subSection: ''
};
const initialSubjectState = {};
const initialCommentState = {};
const initialVideoState = {};
const initialUrlState = {};
function inputReducer(state, action) {
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
function navbarReducer(state, action) {
  switch (action.type) {
    case 'SET_SUBSECTION':
      return {
        ...state,
        subSection: action.subSection
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
    inputReducer,
    initialSubjectState
  );
  const [commentState, commentDispatch] = useReducer(
    inputReducer,
    initialCommentState
  );
  const [videoState, videoDispatch] = useReducer(
    inputReducer,
    initialVideoState
  );
  const [urlState, urlDispatch] = useReducer(inputReducer, initialUrlState);
  const [navbarState, navbarDispatch] = useReducer(
    navbarReducer,
    initialNavbarState
  );
  const value = {
    navbar: { state: navbarState, dispatch: navbarDispatch },
    subject: { state: subjectState, dispatch: subjectDispatch },
    comment: { state: commentState, dispatch: commentDispatch },
    video: { state: videoState, dispatch: videoDispatch },
    url: { state: urlState, dispatch: urlDispatch }
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
