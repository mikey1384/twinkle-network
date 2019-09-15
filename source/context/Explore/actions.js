export default function ExploreActions(dispatch) {
  return {
    onChangeSearchInput(text) {
      return dispatch({
        type: 'CHANGE_SEARCH_INPUT',
        text
      });
    },
    onLoadFeaturedSubjects(subjects) {
      return dispatch({
        type: 'LOAD_FEATURED_SUBJECTS',
        subjects
      });
    },
    onLoadMoreSearchResults({ filter, results, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_SEARCH_RESULTS',
        filter,
        results,
        loadMoreButton
      });
    },
    onLoadSearchResults({ filter, results, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_SEARCH_RESULTS',
        filter,
        results,
        loadMoreButton
      });
    },
    onReloadSubjects() {
      return dispatch({
        type: 'RELOAD_SUBJECTS'
      });
    }
  };
}
