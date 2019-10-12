import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ProfileActions from './Profile/actions';
import ProfileReducer from './Profile/reducer';
import UserActions from './User/actions';
import UserReducer from './User/reducer';
import requestHelpers from './requestHelpers';
import { ChatContextProvider } from './Chat';
import { ContentContextProvider } from './Content';
import { ExploreContextProvider } from './Explore';
import { HomeContextProvider } from './Home';
import { InputContextProvider } from './Input';
import { NotiContextProvider } from './Notification';
import { ViewContextProvider } from './View';
import { initialProfileState } from './initialStates';

export const AppContext = createContext();
export const initialUserState = {
  authLevel: 0,
  canDelete: false,
  canEdit: false,
  canEditRewardLevel: false,
  canStar: false,
  canEditPlaylists: false,
  canPinPlaylists: false,
  defaultSearchFilter: '',
  hideWatched: false,
  isCreator: false,
  loadMoreButton: false,
  loggedIn: false,
  profile: {},
  profileTheme: 'logoBlue',
  profiles: [],
  profilesLoaded: false,
  searchedProfiles: [],
  signinModalShown: false
};

AppContextProvider.propTypes = {
  children: PropTypes.node
};

export function AppContextProvider({ children }) {
  const [profileState, profileDispatch] = useReducer(
    ProfileReducer,
    initialProfileState
  );
  const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
  return (
    <AppContext.Provider
      value={{
        profile: {
          state: profileState,
          actions: ProfileActions(profileDispatch)
        },
        user: {
          state: userState,
          actions: UserActions(userDispatch)
        },
        requestHelpers: requestHelpers(handleError)
      }}
    >
      <ChatContextProvider>
        <HomeContextProvider>
          <ExploreContextProvider>
            <ViewContextProvider>
              <NotiContextProvider>
                <ContentContextProvider>
                  <InputContextProvider>{children} </InputContextProvider>
                </ContentContextProvider>
              </NotiContextProvider>
            </ViewContextProvider>
          </ExploreContextProvider>
        </HomeContextProvider>
      </ChatContextProvider>
    </AppContext.Provider>
  );

  function handleError(error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        return userDispatch({
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
