export default function ExploreActions(dispatch) {
  return {
    onChangeSearchInput(text) {
      return dispatch({
        type: 'CHANGE_SEARCH_INPUT',
        text
      });
    },
    onClearLinksLoaded() {
      return dispatch({
        type: 'CLEAR_LINKS_LOADED'
      });
    },
    onDeleteLink(linkId) {
      return dispatch({
        type: 'DELETE_LINK',
        linkId
      });
    },
    onEditLinkPage({ id, title, content }) {
      return dispatch({
        type: 'EDIT_LINK_PAGE',
        id,
        title,
        content
      });
    },
    onEditLinkTitle(params) {
      return dispatch({
        type: 'EDIT_LINK_TITLE',
        data: params
      });
    },
    onFetchLinks({ links, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_LINKS',
        links,
        loadMoreButton
      });
    },
    onFetchMoreLinks({ links, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_LINKS',
        links,
        loadMoreButton
      });
    },
    onLikeLink({ id, likes }) {
      return dispatch({
        type: 'LIKE_LINK',
        id,
        likes
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
    },
    onUpdateNumLinkComments({ id, updateType }) {
      return dispatch({
        type: 'UPDATE_NUM_LINK_COMMENTS',
        id,
        updateType
      });
    },
    onUploadLink(linkItem) {
      return dispatch({
        type: 'UPLOAD_LINK',
        linkItem
      });
    }
  };
}
