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
    onInitUser(data) {
      return dispatch({
        type: 'INIT_USER',
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
    onSetOrderUsersBy(label) {
      return dispatch({
        type: 'SET_ORDER_USERS_BY',
        label
      });
    },
    onSetProfilesLoaded(loaded) {
      return dispatch({
        type: 'SET_PROFILES_LOADED',
        loaded
      });
    },
    onSetSessionLoaded() {
      return dispatch({
        type: 'SET_SESSION_LOADED'
      });
    },
    onToggleHideWatched(hideWatched) {
      return dispatch({
        type: 'TOGGLE_HIDE_WATCHED',
        hideWatched
      });
    },
    onUpdateNumWordsCollected(numWordsCollected) {
      return dispatch({
        type: 'UPDATE_NUM_WORDS_COLLECTED',
        numWordsCollected
      });
    }
  };
}
