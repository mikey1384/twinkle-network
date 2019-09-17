import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ContentActions from './Content/actions';
import ContentReducer from './Content/reducer';
import ExploreActions from './Explore/actions';
import ExploreReducer from './Explore/reducer';
import HomeActions from './Home/actions';
import HomeReducer from './Home/reducer';
import ProfileActions from './Profile/actions';
import ProfileReducer from './Profile/reducer';
import ViewActions from './View/actions';
import ViewReducer from './View/reducer';
import {
  initialContentState,
  initialExploreState,
  initialHomeState,
  initialProfileState,
  initialViewState
} from './initialStates';
import { InputContextProvider } from './InputContext';
export { InputContext } from './InputContext';

export const Context = createContext();

ContextProvider.propTypes = {
  children: PropTypes.node
};

export function ContextProvider({ children }) {
  const [contentState, contentDispatch] = useReducer(
    ContentReducer,
    initialContentState
  );
  const [exploreState, exploreDispatch] = useReducer(
    ExploreReducer,
    initialExploreState
  );
  const [homeState, homeDispatch] = useReducer(HomeReducer, initialHomeState);
  const [profileState, profileDispatch] = useReducer(
    ProfileReducer,
    initialProfileState
  );
  const [viewState, viewDispatch] = useReducer(ViewReducer, initialViewState);
  return (
    <Context.Provider
      value={{
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
        profile: {
          state: profileState,
          actions: ProfileActions(profileDispatch)
        },
        view: {
          state: viewState,
          actions: ViewActions(viewDispatch)
        }
      }}
    >
      <InputContextProvider>{children}</InputContextProvider>
    </Context.Provider>
  );
}
