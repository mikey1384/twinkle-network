export default function ScrollActions(dispatch) {
  return {
    onRecordScrollPosition({ section, position }) {
      return dispatch({
        type: 'RECORD_SCROLL_POSITION',
        section,
        position
      });
    }
  };
}
