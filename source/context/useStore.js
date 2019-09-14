import { useReducer } from 'react';
import CommentActions from './Comment/actions';
import CommentReducer from './Comment/reducer';
import ContentActions from './Content/actions';
import ContentReducer from './Content/reducer';
import HomeActions from './Home/actions';
import HomeReducer from './Home/reducer';
import InputActions from './Input/actions';
import InputReducer from './Input/reducer';
import ProfileActions from './Profile/actions';
import ProfileReducer from './Profile/reducer';
import {
  initialHomeInputState,
  initialHomeState,
  initialCommentState,
  initialContentState,
  initialProfileState
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

  const [profileState, profileDispatch] = useReducer(
    ProfileReducer,
    initialProfileState
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
    },
    profile: {
      state: profileState,
      actions: ProfileActions(profileDispatch)
    }
  };
}
