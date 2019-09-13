import { useReducer } from 'react';
import CommentActions from './CommentActions';
import CommentReducer from './CommentReducer';
import ContentActions from './ContentActions';
import ContentReducer from './ContentReducer';
import HomeActions from './HomeActions';
import HomeReducer from './HomeReducer';
import InputActions from './InputActions';
import InputReducer from './InputReducer';
import {
  initialHomeInputState,
  initialHomeState,
  initialCommentState,
  initialContentState
} from './initialStates';

export default function useStore() {
  const [commentState, commentDispatch] = useReducer(
    CommentReducer,
    initialCommentState
  );

  const [contentState, contentDispatch] = useReducer(
    ContentReducer,
    initialContentState
  );

  const [homeState, homeDispatch] = useReducer(HomeReducer, initialHomeState);

  const [homeInputState, homeInputDispatch] = useReducer(
    InputReducer,
    initialHomeInputState
  );

  return {
    commentInput: {
      state: commentState,
      actions: CommentActions(commentDispatch)
    },
    content: {
      state: contentState,
      actions: ContentActions(contentDispatch)
    },
    home: {
      state: homeState,
      actions: HomeActions(homeDispatch)
    },
    homeInput: {
      state: homeInputState,
      actions: InputActions(homeInputDispatch)
    }
  };
}
