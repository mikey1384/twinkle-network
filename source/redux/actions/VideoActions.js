import VIDEO from '../constants/Video';

export const onEditPlaylistTitle = ({ playlistId, title }) => ({
  type: VIDEO.EDIT_PLAYLIST_TITLE,
  playlistId,
  title
});

export const editVideoThumbs = params => ({
  type: VIDEO.EDIT_THUMBS,
  params
});

export const onEditVideoTitle = ({ videoId, title }) => ({
  type: VIDEO.EDIT_TITLE,
  videoId,
  title
});

export const emptyCurrentVideoSlot = () => ({
  type: VIDEO.EMPTY_CURRENT_VIDEO_SLOT
});

export const fillCurrentVideoSlot = videoId => ({
  type: VIDEO.FILL_CURRENT_VIDEO_SLOT,
  videoId
});

export const getInitialVideos = ({ loadMoreButton, videos }) => ({
  type: VIDEO.LOAD,
  initialRun: true,
  loadMoreButton,
  videos
});

export const getMoreVideos = ({ videos, loadMoreButton }) => ({
  type: VIDEO.LOAD,
  initialRun: false,
  loadMoreButton,
  videos
});

export const getPinnedPlaylists = playlists => ({
  type: VIDEO.LOAD_FEATURED_PLAYLISTS,
  playlists
});

export const onLoadPlaylists = ({ playlists, loadMoreButton }) => ({
  type: VIDEO.LOAD_PLAYLISTS,
  playlists,
  loadMoreButton
});

export const getMorePlaylists = ({ playlists, isSearch, loadMoreButton }) => ({
  type: VIDEO.LOAD_MORE_PLAYLISTS,
  playlists,
  isSearch,
  loadMoreButton
});

export const likeVideo = ({ likes, videoId }) => ({
  type: VIDEO.LIKE,
  likes,
  videoId
});

export const onLoadMorePlaylistList = data => ({
  type: VIDEO.LOAD_MORE_PL_LIST,
  data
});

export const openAddPlaylistModal = () => ({
  type: VIDEO.OPEN_PLAYLIST_MODAL
});

export const openAddVideoModal = () => ({
  type: VIDEO.OPEN_MODAL
});

export const openReorderFeaturedPlaylists = () => ({
  type: VIDEO.OPEN_REORDER_PINNED_PL_MODAL
});

export const onOpenSelectPlaylistsToPinModal = data => ({
  type: VIDEO.OPEN_SELECT_PL_TO_PIN_MODAL,
  data
});

export const postPlaylist = data => ({
  type: VIDEO.UPLOAD_PLAYLIST,
  data
});

export const setRewardLevel = ({ videoId, rewardLevel }) => ({
  type: VIDEO.SET_REWARD_LEVEL,
  videoId,
  rewardLevel
});

export const setSearchedPlaylists = ({ playlists, loadMoreButton }) => ({
  type: VIDEO.SET_SEARCHED_PLAYLISTS,
  playlists,
  loadMoreButton
});

export const uploadVideo = data => ({
  type: VIDEO.UPLOAD,
  data
});
