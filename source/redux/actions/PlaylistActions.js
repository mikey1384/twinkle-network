import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import PLAYLIST from '../constants/Playlist';

const API_URL = `${URL}/playlist`;

export const changePlaylistVideos = ({ playlistId, playlist }) => ({
  type: PLAYLIST.CHANGE_VIDEOS,
  playlistId,
  playlist
});

export const getPlaylists = () => async dispatch => {
  try {
    const { data } = await request.get(API_URL);
    dispatch({
      type: PLAYLIST.LOAD,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const getMorePlaylists = shownPlaylistsIds => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?${shownPlaylistsIds}`);
    dispatch({
      type: PLAYLIST.LOAD_MORE,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const setSearchedPlaylists = ({ playlists, loadMoreButton }) => ({
  type: PLAYLIST.SET_SEARCHED_PLAYLISTS,
  playlists,
  loadMoreButton
});

export const uploadPlaylist = params => async dispatch => {
  try {
    const {
      data: { result }
    } = await request.post(API_URL, params, auth());
    if (result) {
      dispatch({
        type: PLAYLIST.UPLOAD,
        data: result
      });
    }
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
    const { data } = await request.put(`${API_URL}/title`, params, auth());
    if (data.result) {
      dispatch({
        type: PLAYLIST.EDIT_TITLE,
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

export const deletePlaylist = playlistId => async dispatch => {
  try {
    await request.delete(`${API_URL}?playlistId=${playlistId}`, auth());
    dispatch({
      type: PLAYLIST.DELETE,
      data: playlistId
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const getPinnedPlaylists = () => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}/pinned`);
    dispatch({
      type: PLAYLIST.LOAD_PINNED,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const changePinnedPlaylists = selectedPlaylists => async dispatch => {
  try {
    const {
      data: { playlists }
    } = await request.post(`${API_URL}/pinned`, { selectedPlaylists }, auth());
    if (playlists) {
      dispatch({
        type: PLAYLIST.CHANGE_PINNED,
        data: playlists
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const openSelectPlaylistsToPinModal = () => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}/list`);
    return dispatch({
      type: PLAYLIST.OPEN_SELECT_PL_TO_PIN_MODAL,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMorePlaylistList = playlistId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/list?playlistId=${playlistId}`
    );
    dispatch({
      type: PLAYLIST.LOAD_MORE_PL_LIST,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const likePlaylistVideo = (data, videoId) => ({
  type: PLAYLIST.LIKE_VIDEO,
  data,
  videoId
});

export const closeSelectPlaylistsToPinModal = () => ({
  type: PLAYLIST.CLOSE_SELECT_PL_TO_PIN_MODAL
});

export const openReorderPinnedPlaylistsModal = () => ({
  type: PLAYLIST.OPEN_REORDER_PINNED_PL_MODAL
});

export const closeReorderPinnedPlaylistsModal = () => ({
  type: PLAYLIST.CLOSE_REORDER_PINNED_PL_MODAL
});

export const resetPlaylistState = () => ({
  type: PLAYLIST.RESET
});

export const clickSafeOn = () => ({
  type: PLAYLIST.TURN_ON_CLICK_SAFE
});

export const clickSafeOff = () => ({
  type: PLAYLIST.TURN_OFF_CLICK_SAFE
});
