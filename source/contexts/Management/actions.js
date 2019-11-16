export default function ManagementActions(dispatch) {
  return {
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
