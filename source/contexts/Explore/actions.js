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
    onChangeFeaturedPlaylists(playlists) {
      return dispatch({
        type: 'CHANGE_FEATURED_PLAYLISTS',
        data: playlists
      });
    },
    onChangePlaylistVideos(playlist) {
      return dispatch({
        type: 'CHANGE_PLAYLIST_VIDEOS',
        playlist
      });
    },
    onChangeVideoByUserStatus({ videoId, byUser }) {
      return dispatch({
        type: 'CHANGE_VIDEO_BY_USER_STATUS',
        videoId,
        byUser
      });
    },
    onClearVideosLoaded() {
      return dispatch({
        type: 'CLEAR_VIDEOS_LOADED'
      });
    },
    onClickSafeOff() {
      return dispatch({
        type: 'TURN_OFF_CLICK_SAFE'
      });
    },
    onClickSafeOn() {
      return dispatch({
        type: 'TURN_ON_CLICK_SAFE'
      });
    },
    onCloseAddPlaylistModal() {
      return dispatch({
        type: 'CLOSE_PLAYLIST_MODAL'
      });
    },
    onCloseReorderFeaturedPlaylists() {
      return dispatch({
        type: 'CLOSE_REORDER_PINNED_PL_MODAL'
      });
    },
    onCloseSelectPlaylistsToPinModal() {
      return dispatch({
        type: 'CLOSE_SELECT_PL_TO_PIN_MODAL'
      });
    },
    onDeleteLink(linkId) {
      return dispatch({
        type: 'DELETE_LINK',
        linkId
      });
    },
    onDeletePlaylist(playlistId) {
      return dispatch({
        type: 'DELETE_PLAYLIST',
        data: playlistId
      });
    },
    onDeleteVideo(videoId) {
      return dispatch({
        type: 'DELETE_VIDEO',
        videoId
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
    onEditPlaylistTitle({ playlistId, title }) {
      return dispatch({
        type: 'EDIT_PLAYLIST_TITLE',
        playlistId,
        title
      });
    },
    onEditVideoThumbs(params) {
      return dispatch({
        type: 'EDIT_VIDEO_THUMBS',
        params
      });
    },
    onEmptyCurrentVideoSlot() {
      return dispatch({
        type: 'EMPTY_CURRENT_VIDEO_SLOT'
      });
    },
    onFillCurrentVideoSlot(videoId) {
      return dispatch({
        type: 'FILL_CURRENT_VIDEO_SLOT',
        videoId
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
    onLoadFeaturedPlaylists(playlists) {
      return dispatch({
        type: 'LOAD_FEATURED_PLAYLISTS',
        playlists
      });
    },
    onLikeLink({ id, likes }) {
      return dispatch({
        type: 'LIKE_LINK',
        id,
        likes
      });
    },
    onLikeVideo({ likes, videoId }) {
      return dispatch({
        type: 'LIKE_VIDEO',
        likes,
        videoId
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
    onLoadPlaylists({ playlists, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_PLAYLISTS',
        playlists,
        loadMoreButton
      });
    },
    onLoadMorePlaylists({ playlists, isSearch, loadMoreButton }) {
      return dispatch({
        type: 'LOAD_MORE_PLAYLISTS',
        playlists,
        isSearch,
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
    onOpenAddPlaylistModal() {
      return dispatch({
        type: 'OPEN_PLAYLIST_MODAL'
      });
    },
    onOpenReorderFeaturedPlaylists() {
      return dispatch({
        type: 'OPEN_REORDER_PINNED_PL_MODAL'
      });
    },
    onOpenSelectPlaylistsToPinModal(data) {
      return dispatch({
        type: 'OPEN_SELECT_PL_TO_PIN_MODAL',
        data
      });
    },
    onSetSearchedPlaylists({ playlists, loadMoreButton }) {
      return dispatch({
        type: 'SET_SEARCHED_PLAYLISTS',
        playlists,
        loadMoreButton
      });
    },
    onSetThumbRewardLevel({ videoId, rewardLevel }) {
      return dispatch({
        type: 'SET_REWARD_LEVEL',
        videoId,
        rewardLevel
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
    },
    onUploadPlaylist(data) {
      return dispatch({
        type: 'UPLOAD_PLAYLIST',
        data
      });
    }
  };
}
