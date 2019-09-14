export default function HomeActions(dispatch) {
  return {
    onDeleteNotable({ contentType, contentId }) {
      return dispatch({
        type: 'DELETE_NOTABLE',
        contentType,
        contentId
      });
    },
    onLoadNotables({ notables, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_NOTABLES',
        notables,
        loadMoreButton
      });
    },
    onLoadMoreNotables({ notables, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_NOTABLES',
        notables,
        loadMoreButton
      });
    }
  };
}
