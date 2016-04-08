import request from 'axios';
import {URL} from './URL';

const API_URL = `${URL}/api/video`;

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
