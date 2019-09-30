export default function ViewActions(dispatch) {
  return {
    onChangePageVisibility(visible) {
      return dispatch({
        type: 'CHANGE_PAGE_VISIBILITY',
        visible
      });
    },
    onRecordScrollPosition({ section, position }) {
      return dispatch({
        type: 'RECORD_SCROLL_POSITION',
        section,
        position
      });
    }
  };
}
