import { useReducer } from 'react';
import CommentActions from './CommentActions';
import CommentReducer from './CommentReducer';
import ContentActions from './ContentActions';
import ContentReducer from './ContentReducer';
import InputActions from './InputActions';
import InputReducer from './InputReducer';
import {
  initialHomeInputState,
  initialCommentState,
  initialContentState
} from './initialStates';

export default function useStore() {
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

  return {
    commentInput: {
      state: commentState,
      actions: CommentActions(commentDispatch)
    },
    contentPage: {
      state: contentPageState,
      actions: ContentActions(contentPageDispatch)
    },
    homeInput: {
      state: homeInputState,
      actions: InputActions(homeInputDispatch)
    }
  };
}
