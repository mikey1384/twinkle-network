export default function UserActions(dispatch) {
  return {
    onChangeDefaultSearchFilter(filter) {
      return dispatch({
        type: 'CHANGE_DEFAULT_FILTER',
        filter
      });
    },
    onChangeProfileTheme(theme) {
      return dispatch({
        type: 'CHANGE_PROFILE_THEME',
        theme
      });
    },
    onChangeUserXP({ xp, rank }) {
      return {
        type: 'CHANGE_XP',
        xp,
        rank
      };
    },
    onClearUserSearch() {
      return {
        type: 'CLEAR_USER_SEARCH'
      };
    },
    onCloseSigninModal() {
      return {
        type: 'CLOSE_SIGNIN_MODAL'
      };
    },
    onInitSession(data) {
      return {
        type: 'INIT_SESSION',
        data: { ...data, loggedIn: true }
      };
    },
    onLoadUsers(data) {
      return {
        type: 'LOAD_USERS',
        data
      };
    },
    onLoadMoreUsers(data) {
      return {
        type: 'LOAD_MORE_USERS',
        data
      };
    },
    onLogin(data) {
      return {
        type: 'LOGIN',
        data
      };
    },
    onLogout() {
      localStorage.removeItem('token');
      return {
        type: 'LOGOUT'
      };
    },
    onOpenSigninModal() {
      return {
        type: 'OPEN_SIGNIN_MODAL'
      };
    },
    onRemoveStatusMsg(userId) {
      return {
        type: 'DELETE_STATUS_MSG',
        userId
      };
    },
    onSearchUsers(users) {
      return {
        type: 'SEARCH_USERS',
        users
      };
    },
    onSignup(data) {
      return {
        type: 'SIGNUP',
        data
      };
    },
    onShowProfile(user) {
      return dispatch({
        type: 'SHOW_PROFILE',
        data: user
      });
    },
    onShowProfileComments(profileId) {
      return dispatch({
        type: 'SHOW_PROFILE_COMMENTS',
        profileId
      });
    },
    onToggleHideWatched(hideWatched) {
      return {
        type: 'TOGGLE_HIDE_WATCHED',
        hideWatched
      };
    },
    onUpdateBio(data) {
      return {
        type: 'UPDATE_BIO',
        bio: data.bio,
        userId: data.userId
      };
    },
    onUpdateGreeting(greeting) {
      return {
        type: 'UPDATE_GREETING',
        greeting
      };
    },
    onUpdateProfileInfo(data) {
      return {
        type: 'UPDATE_PROFILE_INFO',
        data
      };
    },
    onUploadProfilePic(data) {
      return {
        type: 'EDIT_PROFILE_PICTURE',
        data
      };
    },
    onUpdateStatusMsg({ statusColor, statusMsg, userId }) {
      return {
        type: 'UPDATE_STATUS_MSG',
        statusColor,
        statusMsg,
        userId
      };
    },
    onUserNotExist() {
      return dispatch({
        type: 'USER_NOT_EXIST'
      });
    }
  };
}
