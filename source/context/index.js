import React, { createContext, useReducer } from 'react';
import CommentReducer from './CommentReducer';
import InputReducer from './InputReducer';
import PropTypes from 'prop-types';
import {
  initialHomeInputState,
  initialCommentState,
  initialUrlState,
  initialSubjectState,
  initialUserState,
  initialVideoState
} from './initialStates';

export const Context = createContext();

ContextProvider.propTypes = {
  children: PropTypes.node
};

export function ContextProvider({ children }) {
  const [subjectState, subjectDispatch] = useReducer(
    CommentReducer,
    initialSubjectState
  );
  const [commentState, commentDispatch] = useReducer(
    CommentReducer,
    initialCommentState
  );
  const [videoState, videoDispatch] = useReducer(
    CommentReducer,
    initialVideoState
  );
  const [urlState, urlDispatch] = useReducer(CommentReducer, initialUrlState);
  const [userState, userDispatch] = useReducer(
    CommentReducer,
    initialUserState
  );

  const [homeInputState, homeInputDispatch] = useReducer(
    InputReducer,
    initialHomeInputState
  );

  const value = {
    subject: { state: subjectState, dispatch: subjectDispatch },
    comment: { state: commentState, dispatch: commentDispatch },
    video: { state: videoState, dispatch: videoDispatch },
    url: { state: urlState, dispatch: urlDispatch },
    input: { state: homeInputState, dispatch: homeInputDispatch },
    user: { state: userState, dispatch: userDispatch }
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
