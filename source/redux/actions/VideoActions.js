import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import VIDEO from '../constants/Video';
import URL from 'constants/URL';

export const addVideoView = params => dispatch => {
  try {
    request.post(`${URL}/video/view`, params);
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const changeByUserStatusForThumbs = ({ videoId, byUser }) => ({
  type: VIDEO.CHANGE_BY_USER_STATUS,
  videoId,
  byUser
});

export const changePinnedPlaylists = selectedPlaylists => async dispatch => {
  try {
    const {
      data: { playlists }
    } = await request.post(
      `${URL}/playlist/pinned`,
      { selectedPlaylists },
      auth()
    );
    if (playlists) {
      dispatch({
        type: VIDEO.CHANGE_PINNED_PLAYLISTS,
        data: playlists
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const changePlaylistVideos = playlist => ({
  type: VIDEO.CHANGE_PLAYLIST_VIDEOS,
  playlist
});

export const clearVideos = () => ({
  type: VIDEO.CLEAR
});

export const clickSafeOff = () => ({
  type: VIDEO.TURN_OFF_CLICK_SAFE
});

export const clickSafeOn = () => ({
  type: VIDEO.TURN_ON_CLICK_SAFE
});

export const closeAddPlaylistModal = () => ({
  type: VIDEO.CLOSE_PLAYLIST_MODAL
});

export const closeAddVideoModal = () => ({
  type: VIDEO.CLOSE_MODAL
});

export const closeReorderPinnedPlaylistsModal = () => ({
  type: VIDEO.CLOSE_REORDER_PINNED_PL_MODAL
});

export const closeSelectPlaylistsToPinModal = () => ({
  type: VIDEO.CLOSE_SELECT_PL_TO_PIN_MODAL
});

export const deletePlaylist = playlistId => async dispatch => {
  try {
    await request.delete(`${URL}/playlist?playlistId=${playlistId}`, auth());
    dispatch({
      type: VIDEO.DELETE_PLAYLIST,
      data: playlistId
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const deleteVideo = ({
  videoId,
  arrayIndex,
  lastVideoId
}) => async dispatch => {
  try {
    const { data } = await request.delete(
      `${URL}/video?videoId=${videoId}&lastVideoId=${lastVideoId}`,
      auth()
    );
    dispatch({
      type: VIDEO.DELETE,
      arrayIndex,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editPlaylistTitle = (
  params,
  arrayNumber,
  sender
) => async dispatch => {
  try {
    const { data } = await request.put(`${URL}/playlist/title`, params, auth());
    if (data.result) {
      dispatch({
        type: VIDEO.EDIT_PLAYLIST_TITLE,
        arrayNumber,
        playlistId: params.playlistId,
        data: data.result
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editVideoThumbs = params => ({
  type: VIDEO.EDIT_THUMBS,
  params
});

export const editVideoTitle = params => async dispatch => {
  try {
    const { data } = await request.post(
      `${URL}/video/edit/title`,
      params,
      auth()
    );
    if (data.result) {
      dispatch({
        type: VIDEO.EDIT_TITLE,
        videoId: params.videoId,
        data: data.result
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const emptyCurrentVideoSlot = () => ({
  type: VIDEO.EMPTY_CURRENT_VIDEO_SLOT
});

export const fillCurrentVideoSlot = videoId => ({
  type: VIDEO.FILL_CURRENT_VIDEO_SLOT,
  videoId
});

export const getInitialVideos = () => async dispatch => {
  try {
    const {
      data: { videos, loadMoreButton }
    } = await request.get(`${URL}/video`);
    dispatch({
      type: VIDEO.LOAD,
      initialRun: true,
      loadMoreButton,
      videos
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const getMoreVideos = ({ videos, loadMoreButton }) => ({
  type: VIDEO.LOAD,
  initialRun: false,
  loadMoreButton,
  videos
});

export const getPinnedPlaylists = () => async dispatch => {
  try {
    const { data } = await request.get(`${URL}/playlist/pinned`);
    dispatch({
      type: VIDEO.LOAD_PINNED_PLAYLISTS,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const getPlaylists = () => async dispatch => {
  try {
    const {
      data: { results, loadMoreButton }
    } = await request.get(`${URL}/playlist`);
    dispatch({
      type: VIDEO.LOAD_PLAYLISTS,
      playlists: results,
      loadMoreButton
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

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

export const loadMorePlaylistList = playlistId => async dispatch => {
  try {
    const { data } = await request.get(
      `${URL}/playlist/list?playlistId=${playlistId}`
    );
    dispatch({
      type: VIDEO.LOAD_MORE_PL_LIST,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const openAddPlaylistModal = () => ({
  type: VIDEO.OPEN_PLAYLIST_MODAL
});

export const openAddVideoModal = () => ({
  type: VIDEO.OPEN_MODAL
});

export const openReorderPinnedPlaylistsModal = () => ({
  type: VIDEO.OPEN_REORDER_PINNED_PL_MODAL
});

export const openSelectPlaylistsToPinModal = () => async dispatch => {
  try {
    const { data } = await request.get(`${URL}/playlist/list`);
    return dispatch({
      type: VIDEO.OPEN_SELECT_PL_TO_PIN_MODAL,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const postPlaylist = data => ({
  type: VIDEO.UPLOAD_PLAYLIST,
  data
});

export const setDifficulty = ({ videoId, difficulty }) => ({
  type: VIDEO.SET_DIFFICULTY,
  videoId,
  difficulty
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
