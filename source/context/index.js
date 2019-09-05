import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const Context = createContext();

const initialSubjectState = {};
const initialCommentState = {};
const initialVideoState = {};
const initialUrlState = {};
function reducer(state, action) {
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
  const [commentState, commentDispatch] = useReducer(
    reducer,
    initialCommentState
  );
  const [videoState, videoDispatch] = useReducer(reducer, initialVideoState);
  const [urlState, urlDispatch] = useReducer(reducer, initialUrlState);
  const value = {
    subject: { state: subjectState, dispatch: subjectDispatch },
    comment: { state: commentState, dispatch: commentDispatch },
    video: { state: videoState, dispatch: videoDispatch },
    url: { state: urlState, dispatch: urlDispatch }
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
