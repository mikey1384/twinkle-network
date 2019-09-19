import USER from '../constants/User';

export const onSearchUsers = users => ({
  type: USER.SEARCH,
  users
});

export const setGreeting = greeting => ({
  type: USER.SET_GREETING,
  greeting
});

export const setProfileInfo = data => ({
  type: USER.SET_PROFILE_INFO,
  data
});

export const showProfileComments = ({ id, shown }) => ({
  type: USER.SHOW_PROFILE_COMMENTS,
  profileId: id,
  shown
});

export const onSignUp = data => ({
  type: USER.SIGNUP,
  data
});

export const onToggleHideWatched = hideWatched => ({
  type: USER.TOGGLE_HIDE_WATCHED,
  hideWatched
});

export const unmountProfile = () => ({
  type: USER.UNMOUNT_PROFILE
});

export const openSigninModal = () => ({
  type: USER.OPEN_SIGNIN_MODAL
});
