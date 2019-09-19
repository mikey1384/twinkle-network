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
import UserActions from './User/actions';
import UserReducer from './User/reducer';
import ViewActions from './View/actions';
import ViewReducer from './View/reducer';
import requestHelpers from './requestHelpers';
import { InputContextProvider } from './InputContext';
import {
  initialContentState,
  initialExploreState,
  initialHomeState,
  initialProfileState,
  initialUserState,
  initialViewState
} from './initialStates';

export const AppContext = createContext();

AppContextProvider.propTypes = {
  children: PropTypes.node
};

export function AppContextProvider({ children }) {
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
  const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
  const [viewState, viewDispatch] = useReducer(ViewReducer, initialViewState);
  return (
    <AppContext.Provider
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
        user: {
          state: userState,
          actions: UserActions(userDispatch)
        },
        view: {
          state: viewState,
          actions: ViewActions(viewDispatch)
        },
        requestHelpers: requestHelpers(handleError)
      }}
    >
      <InputContextProvider>{children}</InputContextProvider>
    </AppContext.Provider>
  );

  function handleError(error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        userDispatch({
          type: 'LOGOUT_AND_OPEN_SIGNIN_MODAL'
        });
      }
      if (status === 301) {
        window.location.reload();
      }
    }
    console.error(error.response || error);
    return Promise.reject(error);
  }
}
