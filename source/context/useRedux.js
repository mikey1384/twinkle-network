import { useReducer } from 'react';
import CommentActions from './CommentActions';
import CommentReducer from './CommentReducer';
import ContentReducer from './ContentReducer';
import InputActions from './InputActions';
import InputReducer from './InputReducer';
import {
  initialHomeInputState,
  initialCommentState,
  initialContentState
} from './initialStates';

export default function useRedux() {
  const [commentState, commentDispatch] = useReducer(
    CommentReducer,
    initialCommentState
  );

  const [homeInputState, homeInputDispatch] = useReducer(
    InputReducer,
    initialHomeInputState
  );

  const [contentPageState, contentPageDispatch] = useReducer(
    ContentReducer,
    initialContentState
  );

  const [linkPageState, linkPageDispatch] = useReducer({
    ContentReducer,
    initialContentState
  });

  return {
    comment: {
      state: commentState,
      actions: CommentActions(commentDispatch)
    },
    homeInput: {
      state: homeInputState,
      actions: InputActions(homeInputDispatch)
    },
    contentPage: {
      state: contentPageState,
      dispatch: contentPageDispatch
    },
    linkPage: {
      state: linkPageState,
      dispatch: linkPageDispatch
    }
  };
}
