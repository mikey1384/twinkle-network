import request from 'axios';
import {URL} from './URL';
import { logout, openSigninModal } from './UserActions';

const API_URL = `${URL}/playlist`;

const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const auth = () => ({
  headers: {
    authorization: token()
  }
})

export function getPlaylists(data, initialRun) {
  return {
    type: 'GET_PLAYLISTS',
    initialRun,
    data
  }
}

export function getPlaylistsAsync() {
  return dispatch => {
    return request.get(`${API_URL}`).then(
      response => dispatch(getPlaylists(response.data, true))
    ).catch(
      error => handleError(error, dispatch)
    )
  }
}

export function getMorePlaylistsAsync(playlistId) {
  return dispatch => {
    return request.get(`${API_URL}?playlistId=${playlistId}`).then(
      response => dispatch(getPlaylists(response.data, false))
    ).catch(
      error => handleError(error, dispatch)
    )
  }
}

export function uploadPlaylist(data) {
  return {
    type: 'UPLOAD_PLAYLIST',
    data
  }
}

export function uploadPlaylistAsync(params) {
  return dispatch => {
    return request.post(API_URL, params, auth()).then(
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
  }
}

export function editPlaylistTitle(arrayNumber, playlistId, data) {
  return {
    type: 'EDIT_PLAYLIST_TITLE',
    arrayNumber,
    playlistId,
    data
  }
}

export function editPlaylistTitleAsync(params, arrayNumber, sender) {
  return dispatch => {
    request.post(`${API_URL}/edit/title`, params, auth()).then(
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
  }
}

export function changePlaylistVideos(playlistId, data) {
  return {
    type: 'CHANGE_PLAYLIST_VIDEOS',
    playlistId,
    data
  }
}

export function changePlaylistVideosAsync(playlistId, selectedVideos, sender) {
  return dispatch => {
    request.post(`${API_URL}/edit/videos`, {playlistId, selectedVideos}, auth()).then(
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
  }
}

export function deletePlaylist(data) {
  return {
    type: 'DELETE_PLAYLIST',
    data
  }
}

export function deletePlaylistAsync(playlistId, sender) {
  return dispatch => {
    request.delete(`${API_URL}?playlistId=${playlistId}`, auth()).then(
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
  }
}

export function getPinnedPlaylists(data) {
  return {
    type: 'GET_PINNED_PLAYLISTS',
    data
  }
}

export function getPinnedPlaylistsAsync() {
  return dispatch => {
    return request.get(`${API_URL}/pinned`).then(
      response => dispatch(getPinnedPlaylists(response.data))
    ).catch(
      error => handleError(error, dispatch)
    )
  }
}

export function changePinnedPlaylists(data) {
  return {
    type: 'CHANGE_PINNED_PLAYLISTS',
    data
  }
}

export function changePinnedPlaylistsAsync(selectedPlaylists, callback) {
  return dispatch => {
    request.post(`${API_URL}/pinned`, {selectedPlaylists}, auth()).then(
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
  }
}

export function openSelectPlaylistsToPinModal(data) {
  return {
    type: 'SELECT_PL_TO_PIN_OPEN',
    data
  }
}

export function openSelectPlaylistsToPinModalAsync() {
  return dispatch => {
    request.get(`${API_URL}/list`).then(
      response => dispatch(openSelectPlaylistsToPinModal(response.data))
    ).catch(
      error => handleError(error, dispatch)
    )
  }
}

export function loadMorePlaylistList(data) {
  return {
    type: 'LOAD_MORE_PLAYLIST_LIST',
    data
  }
}

export function loadMorePlaylistListAsync(playlistId) {
  return dispatch => {
    request.get(`${API_URL}/list?playlistId=${playlistId}`).then(
      response => dispatch(loadMorePlaylistList(response.data))
    ).catch(
      error => handleError(error, dispatch)
    )
  }
}

export function openAddPlaylistModal() {
  return {
    type: 'ADD_PL_MODAL_OPEN'
  }
}

export function getVideosForModal(data) {
  return {
    type: 'GET_VIDEOS_FOR_MODAL',
    initialRun: true,
    data
  }
}

export function getVideosForModalAsync() {
  return dispatch => {
    return request.get(`${URL}/video?numberToLoad=18`).then(
      response => {
        dispatch(getVideosForModal(response.data))
        dispatch(openAddPlaylistModal())
      }
    )
  }
}

export function getMoreVideosForModal(data) {
  return {
    type: 'GET_VIDEOS_FOR_MODAL',
    data
  }
}

export function getMoreVideosForModalAsync(videoId) {
  return dispatch => {
    return request.get(`${URL}/video?numberToLoad=18&videoId=${videoId}`).then(
      response => dispatch(getMoreVideosForModal(response.data))
    )
  }
}

export function openChangePlaylistVideosModal(data) {
  return {
    type: 'CHANGE_PL_VIDS_MODAL_OPEN',
    modalType: 'change',
    data
  }
}

export function openChangePlaylistVideosModalAsync(sender) {
  return dispatch => {
    request.get(`${URL}/video?numberToLoad=18`).then(
      response => {
        dispatch(openChangePlaylistVideosModal(response.data))
        sender.setState({editPlaylistModalShown: true})
      }
    )
  }
}

export function closeAddPlaylistModal() {
  return {
    type: 'ADD_PL_MODAL_CLOSE'
  }
}

export function openReorderPlaylistVideosModal(playlistVideos) {
  return {
    type: 'REORDER_PL_VIDS_MODAL_OPEN',
    modalType: 'reorder',
    playlistVideos
  }
}

export function closeSelectPlaylistsToPinModal() {
  return {
    type: 'SELECT_PL_TO_PIN_CLOSE'
  }
}

export function openReorderPinnedPlaylistsModal() {
  return {
    type: 'REORDER_PINNED_PL_OPEN'
  }
}

export function closeReorderPinnedPlaylistsModal() {
  return {
    type: 'REORDER_PINNED_PL_CLOSE'
  }
}

export function resetPlaylistModalState() {
  return {
    type: 'RESET_PL_MODAL_STATE'
  }
}

export function resetPlaylistState() {
  return {
    type: 'RESET_PL_STATE'
  }
}

function handleError(error, dispatch) {
  if (error.data === 'Unauthorized') {
    dispatch(logout());
    dispatch(openSigninModal());
  } else {
    console.error(error);
  }
}
