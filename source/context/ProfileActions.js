export default function HomeActions(dispatch) {
  return {
    onDeleteFeed({ contentType, contentId }) {
      return dispatch({
        type: 'DELETE_FEED',
        contentType,
        contentId
      });
    },
    onLoadNotables({ feeds, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_NOTABLES',
        feeds,
        loadMoreButton
      });
    },
    onLoadMoreNotables({ feeds, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_NOTABLES',
        feeds,
        loadMoreButton
      });
    },
    onLoadPosts({ feeds, loadMoreButton, section }) {
      return dispatch({
        type: 'LOAD_POSTS',
        feeds,
        loadMoreButton,
        section
      });
    },
    onLoadMorePosts({ feeds, loadMoreButton, section }) {
      return dispatch({
        type: 'LOAD_MORE_POSTS',
        feeds,
        loadMoreButton,
        section
      });
    }
  };
}
