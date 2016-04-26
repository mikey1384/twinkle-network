import request from 'axios';
import {URL} from './URL';

const API_URL = `${URL}/api/video`;

export function getVideos(videos, initialRun) {
  return {
    type: 'GET_VIDEOS',
    initialRun,
    videos: videos
  }
}

export function getInitialVideos() {
  return dispatch => {
    request.get(`${API_URL}`).then(
      response => dispatch(getVideos(response.data, true))
    );
  };
}

export function getMoreVideos(videoId) {
  return dispatch => {
    request.get(`${API_URL}?videoId=${videoId}`).then(
      response => dispatch(getVideos(response.data, false))
    );
  };
}

export function uploadVideo(params) {
  return {
    type: 'UPLOAD_VIDEO',
    promise: request.post(API_URL, params)
  };
}

export function editVideoTitle(params) {
  return {
    type: 'EDIT_VIDEO_TITLE',
    videoId: params.videoId,
    promise: request.post(`${API_URL}/edit/title`, params)
  }
}

export function editVideoPage(params) {
  return {
    type: 'EDIT_VIDEO_PAGE',
    params,
    promise: request.post(`${API_URL}/edit/page`, params)
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

export function loadVideoPage(params) {
  return {
    params,
    promise: request.get(`${API_URL}/loadPage?videoId=${params.videoId}`),
    type: 'LOAD_VIDEO_PAGE'
  }
}

export function resetVideoPage() {
  return {
    type: 'RESET_VIDEO_PAGE'
  }
}

export function resetVideoState() {
  return {
    type: 'RESET_VID_STATE'
  }
}
