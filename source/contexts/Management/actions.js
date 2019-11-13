export default function ManagementActions(dispatch) {
  return {
    onLoadManagement() {
      return dispatch({
        type: 'LOAD_MANAGEMENT'
      });
    }
  };
}
