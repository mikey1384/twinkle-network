import request from 'axios';
import {URL} from './URL';
import {push} from 'react-router-redux';

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

export function uploadVideo(data) {
  return {
    type: 'UPLOAD_VIDEO',
    data
  };
}

export function uploadVideoAsync(params) {
  return dispatch => {
    request.post(API_URL, params).then(
      response => dispatch(uploadVideo(response.data))
    )
  }
}

export function loadVideoPage(data) {
  return {
    type: 'LOAD_VIDEO_PAGE',
    data
  }
}

export function loadVideoPageFromClientSide(videoId) {
  return {
    type: 'LOAD_VIDEO_PAGE_FROM_CLIENT',
    videoId
  }
}

export function loadVideoPageAsync(videoId, cb) {
  return dispatch => {
    request.get(`${API_URL}/loadPage?videoId=${videoId}`).then(
      response => {
        dispatch(loadVideoPage(response.data));
        dispatch(loadVideoCommentsAsync(videoId));
        if (cb) cb();
      }
    )
  }
}

export function loadVideoComments(data) {
  return {
    type: 'LOAD_VIDEO_COMMENTS',
    data
  }
}

export function loadVideoCommentsAsync(videoId) {
  return dispatch => {
    request.get(`${API_URL}/loadComments?videoId=${videoId}`).then(
      response => {
        dispatch(loadVideoComments(response.data))
      }
    )
  }
}

export function likeVideo(data) {
  return {
    type: 'VIDEO_LIKE',
    data
  }
}

export function likeVideoAsync(videoId) {
  return dispatch => {
    request.post(`${API_URL}/like`, {videoId}).then(
      response => {
        dispatch(likeVideo(response.data));
      }
    )
  }
}

export function editVideoTitle(videoId, data) {
  return {
    type: 'EDIT_VIDEO_TITLE',
    videoId,
    data
  }
}

export function editVideoTitleAsync(params, sender) {
  return dispatch => {
    request.post(`${API_URL}/edit/title`, params).then(
      response => {
        dispatch(editVideoTitle(params.videoId, response.data))
        sender.setState({onEdit: false});
      }
    )
  }
}

export function editVideoPage(params, data) {
  return {
    type: 'EDIT_VIDEO_PAGE',
    params,
    data
  }
}

export function editVideoPageAsync(params, sender) {
  return dispatch => {
    request.post(`${API_URL}/edit/page`, params).then(
      response => {
        dispatch(editVideoPage(params, response.data));
        sender.setState({
          onEdit: false,
          editDoneButtonDisabled: true
        })
      }
    )
  }
}

export function deleteVideo(arrayNumber, data) {
  return {
    type: 'DELETE_VIDEO',
    arrayNumber,
    data
  };
}

export function deleteVideoAsync({videoId, arrayNumber, lastVideoId}, sender) {
  return dispatch => {
    request.delete(`${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`).then(
      response => {
        if (!lastVideoId) {
          dispatch(getInitialVideos())
          dispatch(push('/contents'))
        } else {
          dispatch(deleteVideo(arrayNumber, response.data));
          sender.setState({confirmModalShown: false});
        }
      }
    )
  }
}

export function uploadQuestions(data) {
  return {
    type: 'UPLOAD_QUESTIONS',
    data
  }
}

export function uploadQuestionsAsync(data, callback) {
  return dispatch => {
    request.post(`${API_URL}/questions`, data).then(
      response => {
        if (response.data.success) {
          const questions = data.questions.map(row => {
            return {
              title: row.questiontitle,
              choices: [
                row.choice1,
                row.choice2,
                row.choice3,
                row.choice4,
                row.choice5
              ],
              correctChoice: row.correctchoice
            }
          })
          dispatch(uploadQuestions({questions}));
          callback();
        } else {
          dispatch(uploadQuestions({error: response.data.error || "Error"}))
        }
      }
    )
  }
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
