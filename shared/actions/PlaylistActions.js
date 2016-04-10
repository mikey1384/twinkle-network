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

export function getVideosForModal() {
  return {
    type: 'GET_VIDEOS_FOR_MODAL',
    initialRun: true,
    promise: request.get(`${URL}/api/video?numberToLoad=18`)
  }
}

export function getMoreVideosForModal(videoId) {
  return {
    type: 'GET_VIDEOS_FOR_MODAL',
    promise: request.get(`${URL}/api/video?numberToLoad=18&videoId=${videoId}`)
  }
}

export function uploadPlaylist(params) {
  return {
    type: 'UPLOAD_PLAYLIST',
    promise: request.post(API_URL, params)
  }
}

export function editPlaylistTitle(params, arrayNumber) {
  return {
    type: 'EDIT_PLAYLIST_TITLE',
    arrayNumber,
    playlistId: params.playlistId,
    promise: request.post(`${API_URL}/edit/title`, params)
  }
}

export function changePlaylistVideos(playlistId, selectedVideos) {
  const params = {
    playlistId,
    selectedVideos
  }
  return {
    type: 'CHANGE_PLAYLIST_VIDEOS',
    playlistId,
    promise: request.post(`${API_URL}/change/videos`, params)
  }
}

export function resetPlaylistState() {
  return {
    type: 'RESET_PL_STATE'
  }
}

export function openAddPlaylistModal() {
  return {
    type: 'ADD_PL_MODAL_OPEN'
  }
}

export function closeAddPlaylistModal() {
  return {
    type: 'ADD_PL_MODAL_CLOSE'
  }
}

export function openChangePlaylistVideosModal() {
  return {
    type: 'CHANGE_PL_VIDS_MODAL_OPEN',
    modalType: 'change',
    promise: request.get(`${URL}/api/video?numberToLoad=18`)
  }
}

export function openReorderPlaylistVideosModal(playlistVideos) {
  return {
    type: 'REORDER_PL_VIDS_MODAL_OPEN',
    modalType: 'reorder',
    playlistVideos
  }
}

export function resetPlaylistModalState() {
  return {
    type: 'RESET_PL_MODAL_STATE'
  }
}
