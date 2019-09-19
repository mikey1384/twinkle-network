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
    onLogout() {
      localStorage.removeItem('token');
      return {
        type: 'LOGOUT'
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
    onShowProfile(user) {
      return dispatch({
        type: 'SHOW_PROFILE',
        data: user
      });
    },
    onUpdateStatusMsg({ statusColor, statusMsg, userId }) {
      return {
        type: 'EDIT_STATUS_MSG',
        statusColor,
        statusMsg,
        userId
      };
    },
    onUploadBio(data) {
      return {
        type: 'EDIT_BIO',
        bio: data.bio,
        userId: data.userId
      };
    },
    onUploadProfilePic(data) {
      return {
        type: 'EDIT_PROFILE_PICTURE',
        data
      };
    },
    onUserNotExist() {
      return dispatch({
        type: 'USER_NOT_EXIST'
      });
    }
  };
}
