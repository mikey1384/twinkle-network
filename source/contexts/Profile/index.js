import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import ProfileActions from './actions';
import ProfileReducer from './reducer';

export const ProfileContext = createContext();
export const initialProfileState = {};

ProfileContextProvider.propTypes = {
  children: PropTypes.node
};

export function ProfileContextProvider({ children }) {
  const [profileState, profileDispatch] = useReducer(
    ProfileReducer,
    initialProfileState
  );
  return (
    <ProfileContext.Provider
      value={{
        state: profileState,
        actions: ProfileActions(profileDispatch)
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
