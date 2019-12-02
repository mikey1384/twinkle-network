export default function ManagementActions(dispatch) {
  return {
    onChangeModeratorAccountType({ userId, selectedAccountType }) {
      return dispatch({
        type: 'CHANGE_MODERATOR_ACCOUNT_TYPE',
        userId,
        selectedAccountType
      });
    },
    onLoadAccountTypes(accountTypes) {
      return dispatch({
        type: 'LOAD_ACCOUNT_TYPES',
        accountTypes
      });
    },
    onLoadManagement() {
      return dispatch({
        type: 'LOAD_MANAGEMENT'
      });
    },
    onLoadModerators(moderators) {
      return dispatch({
        type: 'LOAD_MODERATORS',
        moderators
      });
    }
  };
}
