import request from 'axios';

export const API_URL = 'http://www.twin-kle.com:3000/api/video';

export function getVideos() {
  return {
    type: 'GET_VIDEOS',
    initialRun: true,
    promise: request.get(`${API_URL}`)
  }
}

export function getMoreVideos(videoId) {
  return {
    type: 'GET_VIDEOS',
    promise: request.get(`${API_URL}?videoId=${videoId}`)
  }
}

export function getVideosForPlaylist() {
  return {
    type: 'GET_VIDEOS_FOR_PLAYLIST',
    initialRun: true,
    promise: request.get(`${API_URL}?numberToLoad=18`)
  }
}

export function getMoreVideosForPlaylist(videoId) {
  return {
    type: 'GET_VIDEOS_FOR_PLAYLIST',
    promise: request.get(`${API_URL}?numberToLoad=18&videoId=${videoId}`)
  }
}

export function uploadVideo(params) {
  return {
    type: 'UPLOAD_VIDEO',
    promise: request.post(API_URL, params)
  };
}

export function editVideoTitle(params, arrayNumber) {
  return {
    type: 'EDIT_VIDEO_TITLE',
    arrayNumber,
    promise: request.post(`${API_URL}/edit/title`, params)
  }
}

export function deleteVideo(videoId, arrayNumber, lastVideoId) {
  return {
    type: 'DELETE_VIDEO',
    arrayNumber,
    promise: request.delete(`${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`)
  };
}

export function openAddVideoModal() {
  return {
    type: 'VID_MODAL_OPEN'
  }
}

export function closeAddVideoModal() {
  return {
    type: 'VID_MODAL_CLOSE'
  }
}

export function resetVideoState() {
  return {
    type: 'RESET_VID_STATE'
  }
}

export function resetAddPlaylistVideoState() {
  return {
    type: 'RESET_PL_VID_STATE'
  }
}
