import request from 'axios';
import { URL } from './URL';
import { push } from 'react-router-redux';
import { logout, openSigninModal } from './UserActions';

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
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.result) {
          dispatch(uploadVideo([data.result]));
        }
        return;
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

export function deleteVideoAsync({videoId, arrayNumber, lastVideoId}) {
  return dispatch => {
    request.delete(`${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.result) {
          if (!lastVideoId) {
            dispatch(getInitialVideos())
            dispatch(push('/contents'))
          } else {
            dispatch(deleteVideo(arrayNumber, data.result));
          }
        }
        return;
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
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.result) {
          dispatch(editVideoTitle(params.videoId, data.result))
          sender.setState({onEdit: false});
        }
        return;
      }
    )
  }
}

export function editVideoPage(params) {
  return {
    type: 'EDIT_VIDEO_PAGE',
    params
  }
}

export function editVideoPageAsync(params, sender) {
  return dispatch => {
    request.post(`${API_URL}/edit/page`, params).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.success) {
          dispatch(editVideoPage(params));
          sender.setState({
            onEdit: false,
            editDoneButtonDisabled: true
          })
        }
        return;
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

export function uploadQuestionsAsync(params, callback) {
  return dispatch => {
    request.post(`${API_URL}/questions`, params).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.success) {
          const questions = params.questions.map(question => {
            return {
              title: question.questiontitle,
              choices: [
                question.choice1,
                question.choice2,
                question.choice3,
                question.choice4,
                question.choice5
              ],
              correctChoice: question.correctchoice
            }
          })
          dispatch(uploadQuestions(questions));
          callback();
        }
        return;
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
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.likes) {
          dispatch(likeVideo(data.likes));
        }
        return;
      }
    )
  }
}

export function likeVideoComment(data) {
  return {
    type: 'VIDEO_COMMENT_LIKE',
    data
  }
}

export function likeVideoCommentAsync(commentId) {
  return dispatch => {
    request.post(`${API_URL}/comments/like`, {commentId}).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.likes) {
          dispatch(likeVideoComment({commentId, likes: data.likes}))
        }
        return;
      }
    )
  }
}

export function likeVideoReply(data) {
  return {
    type: 'VIDEO_REPLY_LIKE',
    data
  }
}

export function likeVideoReplyAsync(replyId, commentId) {
  return dispatch => {
    request.post(`${API_URL}/replies/like`, {replyId, commentId}).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.likes) {
          dispatch(likeVideoReply({replyId, commentId, likes: data.likes}))
        }
        return;
      }
    )
  }
}

export function loadVideoPage(data) {
  return {
    type: 'LOAD_VIDEO_PAGE',
    data
  }
}

export function loadVideoPageAsync(videoId) {
  return dispatch => {
    request.get(`${API_URL}/loadPage?videoId=${videoId}`).then(
      response => {
        dispatch(loadVideoPage(response.data));
        dispatch(loadVideoCommentsAsync(videoId));
      }
    )
  }
}

export function loadVideoPageFromClientSide(data) {
  return {
    type: 'LOAD_VIDEO_PAGE_FROM_CLIENT',
    data
  }
}

export function loadVideoPageFromClientSideAsync(params, to) {
  return dispatch => {
    dispatch(loadVideoPageFromClientSide(params))
    dispatch(push(`/${to}`))
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
    request.get(`${API_URL}/comments?videoId=${videoId}`).then(
      response => {
        dispatch(loadVideoComments(response.data))
      }
    )
  }
}

export function uploadVideoComment(data) {
  return {
    type: 'UPLOAD_VIDEO_COMMENT',
    data
  }
}

export function uploadVideoCommentAsync(comment, videoId) {
  return dispatch => {
    request.post(`${API_URL}/comments`, {comment, videoId}).then(
      response => {
        const { data } = response;
        if (data.error) {
          return handleError(data.error, dispatch);
        }
        dispatch(uploadVideoComment(data));
      }
    )
  }
}

export function uploadVideoReply(data) {
  return {
    type: 'UPLOAD_VIDEO_REPLY',
    data
  }
}

export function uploadVideoReplyAsync(reply, commentId, videoId) {
  return dispatch => {
    request.post(`${API_URL}/replies`, {reply, commentId, videoId}).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.result) {
          dispatch(uploadVideoReply({commentId, reply: data.result}))
        }
        return;
      }
    )
  }
}


export function editVideoComment(data) {
  return {
    type: 'EDIT_VIDEO_COMMENT',
    data
  }
}

export function editVideoCommentAsync(editedComment, commentId, cb) {
  return dispatch => {
    request.post(`${API_URL}/comments/edit`, {editedComment, commentId}).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch);
        }
        if (data.success) {
          dispatch(editVideoComment({editedComment, commentId}));
          cb();
        }
        return;
      }
    )
  }
}

export function deleteVideoComment(data) {
  return {
    type: 'DELETE_VIDEO_COMMENT',
    data
  }
}

export function deleteVideoCommentAsync(commentId) {
  return dispatch => {
    request.delete(`${API_URL}/comments?commentId=${commentId}`).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch)
        }
        if (data.success) {
          dispatch(deleteVideoComment({commentId}));
        }
        return;
      }
    )
  }
}

export function editVideoReply(data) {
  return {
    type: 'EDIT_VIDEO_REPLY',
    data
  }
}

export function editVideoReplyAsync({editedReply, replyId, commentId}, cb) {
  return dispatch => {
    request.post(`${API_URL}/replies/edit`, {editedReply, replyId}).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch)
        }
        if (data.success) {
          dispatch(editVideoReply({editedReply, replyId, commentId}));
          cb();
        }
        return;
      }
    )
  }
}

export function deleteVideoReply(data) {
  return {
    type: 'DELETE_VIDEO_REPLY',
    data
  }
}

export function deleteVideoReplyAsync(replyId, commentId) {
  return dispatch => {
    request.delete(`${API_URL}/replies?replyId=${replyId}`).then(
      response => {
        const { data } = response;
        if (data.error) {
          handleError(data.error, dispatch)
        }
        if (data.success) {
          dispatch(deleteVideoReply({replyId, commentId}))
        }
        return;
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

function handleError(error, dispatch) {
  if (error.invalidSession) {
    dispatch(logout());
    dispatch(openSigninModal());
  } else {
    console.error(error);
  }
}
