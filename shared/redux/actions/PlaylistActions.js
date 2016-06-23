import request from 'axios';
import { URL } from 'constants/URL';
import { logout, openSigninModal } from './UserActions';

const API_URL = `${URL}/playlist`;

const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const auth = () => ({
  headers: {
    authorization: token()
  }
})

export const getPlaylists = (data, initialRun) => ({
  type: 'GET_PLAYLISTS',
  initialRun,
  data
})

export const getPlaylistsAsync = () => dispatch => request.get(API_URL)
.then(
  response => dispatch(getPlaylists(response.data, true))
).catch(
  error => handleError(error, dispatch)
)

export const getMorePlaylistsAsync = playlistId => dispatch => request.get(`${API_URL}?playlistId=${playlistId}`)
.then(
  response => dispatch(getPlaylists(response.data, false))
).catch(
  error => handleError(error, dispatch)
)

export const uploadPlaylist = data => ({
  type: 'UPLOAD_PLAYLIST',
  data
})

export const uploadPlaylistAsync = params => dispatch => request.post(API_URL, params, auth())
.then(
  response => {
    const { data } = response;
    if (data.result) {
      dispatch(uploadPlaylist(data.result))
      dispatch(closeAddPlaylistModal())
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const editPlaylistTitle = (arrayNumber, playlistId, data) => ({
  type: 'EDIT_PLAYLIST_TITLE',
  arrayNumber,
  playlistId,
  data
})

export const editPlaylistTitleAsync = (params, arrayNumber, sender) => dispatch =>
request.post(`${API_URL}/edit/title`, params, auth())
.then(
  response => {
    const { data } = response;
    if (data.result) {
      dispatch(editPlaylistTitle(arrayNumber, params.playlistId, data.result))
      sender.setState({onEdit: false})
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const changePlaylistVideos = (playlistId, data) => ({
  type: 'CHANGE_PLAYLIST_VIDEOS',
  playlistId,
  data
})

export const changePlaylistVideosAsync = (playlistId, selectedVideos, sender) => dispatch =>
request.post(`${API_URL}/edit/videos`, {playlistId, selectedVideos}, auth())
.then(
  response => {
    const { data } = response;
    if (data.result) {
      dispatch(changePlaylistVideos(playlistId, data.result))
      sender.props.onHide()
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const deletePlaylist = data => ({
  type: 'DELETE_PLAYLIST',
  data
})

export const deletePlaylistAsync = (playlistId, sender) => dispatch =>
request.delete(`${API_URL}?playlistId=${playlistId}`, auth())
.then(
  response => {
    const { data } = response;
    if (data.success) {
      dispatch(deletePlaylist(playlistId))
      sender.setState({deleteConfirmModalShown: false})
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const getPinnedPlaylists = data => ({
  type: 'GET_PINNED_PLAYLISTS',
  data
})

export const getPinnedPlaylistsAsync = () => dispatch => request.get(`${API_URL}/pinned`)
.then(
  response => dispatch(getPinnedPlaylists(response.data))
).catch(
  error => handleError(error, dispatch)
)

export const changePinnedPlaylists = data => ({
  type: 'CHANGE_PINNED_PLAYLISTS',
  data
})

export const changePinnedPlaylistsAsync = (selectedPlaylists, callback) => dispatch =>
request.post(`${API_URL}/pinned`, {selectedPlaylists}, auth())
.then(
  response => {
    const { data } = response;
    if (data.playlists) {
      dispatch(changePinnedPlaylists(data.playlists))
      callback()
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const openSelectPlaylistsToPinModal = data => ({
  type: 'SELECT_PL_TO_PIN_OPEN',
  data
})

export const openSelectPlaylistsToPinModalAsync = () => dispatch => request.get(`${API_URL}/list`)
.then(
  response => dispatch(openSelectPlaylistsToPinModal(response.data))
).catch(
  error => handleError(error, dispatch)
)

export const loadMorePlaylistList = data => ({
  type: 'LOAD_MORE_PLAYLIST_LIST',
  data
})

export const loadMorePlaylistListAsync = playlistId => dispatch =>
request.get(`${API_URL}/list?playlistId=${playlistId}`)
.then(
  response => dispatch(loadMorePlaylistList(response.data))
).catch(
  error => handleError(error, dispatch)
)

export const openAddPlaylistModal = () => ({
  type: 'ADD_PL_MODAL_OPEN'
})

export const getVideosForModal = data => ({
  type: 'GET_VIDEOS_FOR_MODAL',
  initialRun: true,
  data
})

export const getVideosForModalAsync = () => dispatch => request.get(`${URL}/video?numberToLoad=18`)
.then(
  response => {
    dispatch(getVideosForModal(response.data))
    dispatch(openAddPlaylistModal())
  }
).catch(
  error => handleError(error, dispatch)
)

export const getMoreVideosForModal = data => ({
  type: 'GET_VIDEOS_FOR_MODAL',
  data
})

export const getMoreVideosForModalAsync = videoId => dispatch =>
request.get(`${URL}/video?numberToLoad=18&videoId=${videoId}`)
.then(
  response => dispatch(getMoreVideosForModal(response.data))
).catch(
  error => handleError(error, dispatch)
)

export const openChangePlaylistVideosModal = data => ({
  type: 'CHANGE_PL_VIDS_MODAL_OPEN',
  modalType: 'change',
  data
})

export const openChangePlaylistVideosModalAsync = sender => dispatch => request.get(`${URL}/video?numberToLoad=18`)
.then(
  response => {
    dispatch(openChangePlaylistVideosModal(response.data))
    sender.setState({editPlaylistModalShown: true})
  }
).catch(
  error => handleError(error, dispatch)
)

export const closeAddPlaylistModal = () => ({
  type: 'ADD_PL_MODAL_CLOSE'
})

export const openReorderPlaylistVideosModal = playlistVideos => ({
  type: 'REORDER_PL_VIDS_MODAL_OPEN',
  modalType: 'reorder',
  playlistVideos
})

export const likePlaylistVideo = (data, videoId) => ({
  type: 'PLAYLIST_VIDEO_LIKE',
  data,
  videoId
})

export const closeSelectPlaylistsToPinModal = () => ({
  type: 'SELECT_PL_TO_PIN_CLOSE'
})

export const openReorderPinnedPlaylistsModal = () => ({
  type: 'REORDER_PINNED_PL_OPEN'
})

export const closeReorderPinnedPlaylistsModal = () => ({
  type: 'REORDER_PINNED_PL_CLOSE'
})

export const resetPlaylistModalState = () => ({
  type: 'RESET_PL_MODAL_STATE'
})

export const resetPlaylistState = () => ({
  type: 'RESET_PL_STATE'
})

function handleError(error, dispatch) {
  if (error.data === 'Unauthorized') {
    dispatch(logout());
    dispatch(openSigninModal());
  } else {
    console.error(error);
  }
}
