export default function ManagementActions(dispatch) {
  return {
    onAddModerators(newModerators) {
      return dispatch({
        type: 'ADD_MODERATORS',
        newModerators
      });
    },
    onChangeModeratorAccountType({ userId, selectedAccountType }) {
      return dispatch({
        type: 'CHANGE_MODERATOR_ACCOUNT_TYPE',
        userId,
        selectedAccountType
      });
    },
    onEditAccountType({ label, editedAccountType }) {
      return dispatch({
        type: 'EDIT_ACCOUNT_TYPE',
        label,
        editedAccountType
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
