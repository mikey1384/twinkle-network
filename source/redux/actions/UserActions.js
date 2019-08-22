import request from 'axios';
import { token, auth, handleError } from 'helpers/requestHelpers';
import USER from '../constants/User';
import URL from 'constants/URL';

const API_URL = `${URL}/user`;

export const clearProfiles = () => ({
  type: USER.CLEAR
});

export const updateDefaultSearchFilter = filter => ({
  type: USER.CHANGE_DEFAULT_FILTER,
  filter
});

export const changeProfileTheme = theme => ({
  type: USER.CHANGE_PROFILE_THEME,
  theme
});

export const changeUserXP = params => async dispatch => {
  try {
    const {
      data: { xp, alreadyDone, rank }
    } = await request.post(`${API_URL}/xp`, params, auth());
    if (alreadyDone) return;
    return dispatch({
      type: USER.CHANGE_XP,
      xp,
      rank
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const checkValidUsername = username => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/username/check?username=${username}`
    );
    if (data.pageNotExists) {
      return dispatch({
        type: USER.NOT_EXIST
      });
    }
    dispatch({
      type: USER.SHOW_PROFILE,
      data: data.user
    });
  } catch (error) {
    dispatch({
      type: USER.NOT_EXIST
    });
    handleError(error, dispatch);
  }
};

export const clearUserSearch = () => ({
  type: USER.CLEAR_SEARCH
});

export const fetchUsers = orderBy => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/users${orderBy ? `?orderBy=${orderBy}` : ''}`
    );
    dispatch({
      type: USER.LOAD_USERS,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const fetchMoreUsers = ({
  orderBy,
  shownUsersIds
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/users?${shownUsersIds}${orderBy ? `&orderBy=${orderBy}` : ''}`
    );
    dispatch({
      type: USER.LOAD_MORE_USERS,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const initSession = pathname => async dispatch => {
  if (token() === null) {
    return request.post(`${API_URL}/recordAnonTraffic`, { pathname });
  }
  try {
    const { data } = await request.get(
      `${API_URL}/session?pathname=${pathname}`,
      auth()
    );
    dispatch({
      type: USER.INIT_SESSION,
      data: { ...data, loggedIn: true }
    });
  } catch (error) {
    console.error(error.response || error);
  }
};

export const login = params => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/login`, params);
    localStorage.setItem('token', data.token);
    dispatch({
      type: USER.LOGIN,
      data
    });
  } catch (error) {
    if (error.response.status === 401) {
      return Promise.reject('Incorrect username/password combination');
    }
    return Promise.reject('There was an error');
  }
};

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

export const searchUsers = query => async dispatch => {
  try {
    const { data: users } = await request.get(
      `${API_URL}/users/search?queryString=${query}`
    );
    dispatch({
      type: USER.SEARCH,
      users
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const setGreeting = greeting => ({
  type: USER.SET_GREETING,
  greeting
});

export const setProfileInfo = data => ({
  type: USER.SET_PROFILE_INFO,
  data
});

export const signup = params => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/signup`, params);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    dispatch({
      type: USER.SIGNUP,
      data
    });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error.response?.data || error);
  }
};

export const toggleHideWatched = () => async dispatch => {
  try {
    const {
      data: { hideWatched }
    } = await request.put(`${API_URL}/hideWatched`, {}, auth());
    dispatch({
      type: USER.TOGGLE_HIDE_WATCHED,
      hideWatched
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const unmountProfile = () => ({
  type: USER.UNMOUNT_PROFILE
});

export const updateStatusMsg = ({ statusColor, statusMsg, userId }) => ({
  type: USER.EDIT_STATUS_MSG,
  statusColor,
  statusMsg,
  userId
});

export const uploadBio = params => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/bio`, params, auth());
    dispatch({
      type: USER.EDIT_BIO,
      bio: data.bio,
      userId: data.userId
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const uploadProfilePic = image => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/picture`,
      { image },
      auth()
    );
    dispatch({
      type: USER.EDIT_PROFILE_PICTURE,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const openSigninModal = () => ({
  type: USER.OPEN_SIGNIN_MODAL
});

export const closeSigninModal = () => ({
  type: USER.CLOSE_SIGNIN_MODAL
});
