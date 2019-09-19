import USER from '../constants/User';

export const clearUserSearch = () => ({
  type: USER.CLEAR_SEARCH
});

export const fetchUsers = data => ({
  type: USER.LOAD_USERS,
  data
});

export const fetchMoreUsers = data => ({
  type: USER.LOAD_MORE_USERS,
  data
});

export const onInitSession = data => ({
  type: USER.INIT_SESSION,
  data: { ...data, loggedIn: true }
});

export const onLogin = data => ({
  type: USER.LOGIN,
  data
});

export const logout = () => {
  localStorage.removeItem('token');
  return {
    type: USER.LOGOUT
  };
};

export const removeStatusMsg = userId => ({
  type: USER.DELETE_STATUS_MSG,
  userId
});

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

export const updateStatusMsg = ({ statusColor, statusMsg, userId }) => ({
  type: USER.EDIT_STATUS_MSG,
  statusColor,
  statusMsg,
  userId
});

export const onUploadBio = data => ({
  type: USER.EDIT_BIO,
  bio: data.bio,
  userId: data.userId
});

export const onUploadProfilePic = data => ({
  type: USER.EDIT_PROFILE_PICTURE,
  data
});

export const openSigninModal = () => ({
  type: USER.OPEN_SIGNIN_MODAL
});

export const closeSigninModal = () => ({
  type: USER.CLOSE_SIGNIN_MODAL
});
