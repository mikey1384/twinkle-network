import USER from '../constants/User';

export const onToggleHideWatched = hideWatched => ({
  type: USER.TOGGLE_HIDE_WATCHED,
  hideWatched
});

export const openSigninModal = () => ({
  type: USER.OPEN_SIGNIN_MODAL
});
