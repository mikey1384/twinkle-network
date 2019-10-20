export default function HomeActions(dispatch) {
  return {
    onChangeCategory(category) {
      return dispatch({
        type: 'CHANGE_CATEGORY',
        category
      });
    },
    onChangeSubFilter(subFilter) {
      return dispatch({
        type: 'CHANGE_SUB_FILTER',
        subFilter
      });
    },
    onLoadFeeds({ feeds, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_FEEDS',
        feeds,
        loadMoreButton
      });
    },
    onLoadMoreFeeds({ feeds, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_FEEDS',
        feeds,
        loadMoreButton
      });
    },
    onLoadNewFeeds(data) {
      return dispatch({
        type: 'LOAD_NEW_FEEDS',
        data
      });
    },
    onReloadFeeds() {
      return dispatch({
        type: 'RELOAD_FEEDS'
      });
    }
  };
}
