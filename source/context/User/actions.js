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
    onShowProfile(user) {
      return dispatch({
        type: 'SHOW_PROFILE',
        data: user
      });
    },
    onUserNotExist() {
      return dispatch({
        type: 'USER_NOT_EXIST'
      });
    }
  };
}
