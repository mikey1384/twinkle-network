import { useReducer } from 'react';
import CommentActions from './Comment/actions';
import CommentReducer from './Comment/reducer';
import ContentActions from './Content/actions';
import ContentReducer from './Content/reducer';
import ExploreActions from './Explore/actions';
import ExploreReducer from './Explore/reducer';
import HomeActions from './Home/actions';
import HomeReducer from './Home/reducer';
import InputActions from './Input/actions';
import InputReducer from './Input/reducer';
import ProfileActions from './Profile/actions';
import ProfileReducer from './Profile/reducer';
import ViewActions from './View/actions';
import ViewReducer from './View/reducer';
import {
  initialCommentState,
  initialContentState,
  initialExploreState,
  initialHomeInputState,
  initialHomeState,
  initialProfileState,
  initialViewState
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

  const [exploreState, exploreDispatch] = useReducer(
    ExploreReducer,
    initialExploreState
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

  const [viewState, viewDispatch] = useReducer(ViewReducer, initialViewState);

  return {
    commentInput: {
      state: commentState,
      actions: CommentActions(commentDispatch)
    },
    content: {
      state: contentState,
      actions: ContentActions(contentDispatch)
    },
    explore: {
      state: exploreState,
      actions: ExploreActions(exploreDispatch)
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
    },
    view: {
      state: viewState,
      actions: ViewActions(viewDispatch)
    }
  };
}
