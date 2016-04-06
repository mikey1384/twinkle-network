import request from 'axios';
import {URL} from './URL';

const API_URL = `${URL}/api/playlist`;

export function getPlaylists() {
  return {
    type: 'GET_PLAYLISTS',
    initialRun: true,
    promise: request.get(`${API_URL}`)
  }
}

export function getMorePlaylists(playlistId) {
  return {
    type: 'GET_PLAYLISTS',
    promise: request.get(`${API_URL}?playlistId=${playlistId}`)
  }
}

export function getPinnedPlaylists() {
  return {
    type: 'GET_PINNED_PLAYLISTS',
    initialRun: true,
    promise: request.get(`${API_URL}?pinned=true`)
  }
}

export function uploadPlaylist(params) {
  return {
    type: 'UPLOAD_PLAYLIST',
    promise: request.post(API_URL, params)
  }
}

export function resetPlaylistState() {
  return {
    type: 'RESET_PL_STATE'
  }
}

export function openAddPlaylistModal() {
  return {
    type: 'PL_MODAL_OPEN'
  }
}

export function closeAddPlaylistModal() {
  return {
    type: 'PL_MODAL_CLOSE'
  }
}
