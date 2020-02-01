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
    },
    onSetExploreCategory(category) {
      return dispatch({
        type: 'SET_EXPLORE_CATEGORY',
        category
      });
    },
    onSetExploreSubNav(nav) {
      return dispatch({
        type: 'SET_EXPLORE_SUB_NAV',
        nav
      });
    },
    onSetExplorePath(path) {
      return dispatch({
        type: 'SET_EXPLORE_PATH',
        path
      });
    },
    onSetHomeNav(nav) {
      return dispatch({
        type: 'SET_HOME_NAV',
        nav
      });
    },
    onSetProfileNav(nav) {
      return dispatch({
        type: 'SET_PROFILE_NAV',
        nav
      });
    }
  };
}
