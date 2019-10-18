export default function UserActions(dispatch) {
  return {
    onChangeDefaultSearchFilter(filter) {
      return dispatch({
        type: 'CHANGE_DEFAULT_FILTER',
        filter
      });
    },
    onClearUserSearch() {
      return dispatch({
        type: 'CLEAR_USER_SEARCH'
      });
    },
    onCloseSigninModal() {
      return dispatch({
        type: 'CLOSE_SIGNIN_MODAL'
      });
    },
    onInitSession(data) {
      return dispatch({
        type: 'INIT_SESSION',
        data: { ...data, loggedIn: true }
      });
    },
    onLoadUsers(data) {
      return dispatch({
        type: 'LOAD_USERS',
        data
      });
    },
    onLoadMoreUsers(data) {
      return dispatch({
        type: 'LOAD_MORE_USERS',
        data
      });
    },
    onLogin(data) {
      return dispatch({
        type: 'LOGIN',
        data
      });
    },
    onLogout() {
      localStorage.removeItem('token');
      return dispatch({
        type: 'LOGOUT'
      });
    },
    onOpenSigninModal() {
      return dispatch({
        type: 'OPEN_SIGNIN_MODAL'
      });
    },
    onRemoveStatusMsg(userId) {
      return dispatch({
        type: 'DELETE_STATUS_MSG',
        userId
      });
    },
    onSearchUsers(users) {
      return dispatch({
        type: 'SEARCH_USERS',
        users
      });
    },
    onSignup(data) {
      return dispatch({
        type: 'SIGNUP',
        data
      });
    },
    onSetProfilesLoaded(loaded) {
      return dispatch({
        type: 'SET_PROFILES_LOADED',
        loaded
      });
    },
    onShowProfile(user) {
      return dispatch({
        type: 'SHOW_PROFILE',
        data: user
      });
    },
    onToggleHideWatched(hideWatched) {
      return dispatch({
        type: 'TOGGLE_HIDE_WATCHED',
        hideWatched
      });
    },
    onUpdateBio(data) {
      return dispatch({
        type: 'UPDATE_BIO',
        bio: data.bio,
        userId: data.userId
      });
    },
    onUpdateGreeting(greeting) {
      return dispatch({
        type: 'UPDATE_GREETING',
        greeting
      });
    },
    onUpdateProfileInfo(data) {
      return dispatch({
        type: 'UPDATE_PROFILE_INFO',
        data
      });
    },
    onUploadProfilePic(data) {
      return dispatch({
        type: 'EDIT_PROFILE_PICTURE',
        data
      });
    },
    onUpdateStatusMsg({ statusColor, statusMsg, userId }) {
      return dispatch({
        type: 'UPDATE_STATUS_MSG',
        statusColor,
        statusMsg,
        userId
      });
    }
  };
}
