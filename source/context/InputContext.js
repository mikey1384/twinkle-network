import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import CommentActions from './Comment/actions';
import CommentReducer from './Comment/reducer';
import InputActions from './Input/actions';
import InputReducer from './Input/reducer';
import { initialCommentState, initialHomeInputState } from './initialStates';

export const InputContext = createContext();

InputContextProvider.propTypes = {
  children: PropTypes.node
};
export function InputContextProvider({ children }) {
  const [homeInputState, homeInputDispatch] = useReducer(
    InputReducer,
    initialHomeInputState
  );
  const [commentState, commentDispatch] = useReducer(
    CommentReducer,
    initialCommentState
  );
  return (
    <InputContext.Provider
      value={{
        commentInput: {
          state: commentState,
          actions: CommentActions(commentDispatch)
        },
        homeInput: {
          state: homeInputState,
          actions: InputActions(homeInputDispatch)
        }
      }}
    >
      {children}
    </InputContext.Provider>
  );
}
