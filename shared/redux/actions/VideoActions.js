import request from 'axios';
import { URL } from 'constants/URL';
import { push } from 'react-router-redux';
import { logout, openSigninModal } from './UserActions';

const API_URL = `${URL}/video`;

const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const auth = () => ({
  headers: {
    authorization: token()
  }
})

export const getVideos = (videos, initialRun) => ({
  type: 'GET_VIDEOS',
  initialRun,
  videos: videos
})

export const getInitialVideos = () => dispatch => request.get(`${API_URL}`)
.then(
  response => dispatch(getVideos(response.data, true))
).catch(
  error => handleError(error, dispatch)
)

export const getMoreVideos = videoId => dispatch => request.get(`${API_URL}?videoId=${videoId}`)
.then(
  response => dispatch(getVideos(response.data, false))
)

export const uploadVideo = data => ({
  type: 'UPLOAD_VIDEO',
  data
})

export const uploadVideoAsync = params => dispatch => request.post(API_URL, params, auth())
.then(
  response => {
    const { data } = response;
    if (data.result) {
      dispatch(uploadVideo([data.result]));
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const deleteVideo = (arrayNumber, data) => ({
  type: 'DELETE_VIDEO',
  arrayNumber,
  data
})

export const deleteVideoAsync = ({videoId, arrayNumber, lastVideoId}) => dispatch =>
request.delete(`${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`, auth())
.then(
  response => {
    const { data } = response;
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
).catch(
  error => handleError(error, dispatch)
)

export const editVideoTitle = (videoId, data) => ({
  type: 'EDIT_VIDEO_TITLE',
  videoId,
  data
})

export const editVideoTitleAsync = (params, sender) => dispatch =>
request.post(`${API_URL}/edit/title`, params, auth())
.then(
  response => {
    const { data } = response;
    if (data.result) {
      dispatch(editVideoTitle(params.videoId, data.result))
      sender.setState({onEdit: false});
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const likeVideo = data => ({
  type: 'VIDEO_LIKE',
  data
})

export const likeVideoAsync = videoId => dispatch => request.post(`${API_URL}/like`, {videoId}, auth())
.then(
  response => {
    const { data } = response;
    if (data.likes) {
      dispatch(likeVideo(data.likes));
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const editVideoPage = params => ({
  type: 'EDIT_VIDEO_PAGE',
  params
})

export const editVideoPageAsync = (params, sender) => dispatch =>
request.post(`${API_URL}/edit/page`, params, auth())
.then(
  response => {
    const { data } = response;
    if (data.success) {
      dispatch(editVideoPage(params));
      sender.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const loadVideoPage = data => ({
  type: 'LOAD_VIDEO_PAGE',
  data
})

export const loadVideoPageAsync = (videoId, callback) => dispatch =>
request.get(`${API_URL}/loadPage?videoId=${videoId}`)
.then(
  response => {
    dispatch(loadVideoPage(response.data));
    dispatch(loadVideoCommentsAsync(videoId));
    if (callback) callback();
  }
).catch(
  error => handleError(error, dispatch)
)

export const loadVideoPageFromClientSideAsync = (videoId, to) =>
dispatch => dispatch(loadVideoPageAsync(videoId, dispatch(push(`/${to}`))))

export const loadVideoComments = data => ({
  type: 'LOAD_VIDEO_COMMENTS',
  data
})

export const loadVideoCommentsAsync = videoId => dispatch => request.get(`${API_URL}/comments?videoId=${videoId}`)
.then(
  response => dispatch(loadVideoComments(response.data))
).catch(
  error => handleError(error, dispatch)
)

export const uploadVideoComment = data => ({
  type: 'UPLOAD_VIDEO_COMMENT',
  data
})

export const uploadVideoCommentAsync = (comment, videoId) => dispatch =>
request.post(`${API_URL}/comments`, {comment, videoId}, auth())
.then(
  response => {
    const { data } = response;
    dispatch(uploadVideoComment(data));
  }
).catch(
  error => handleError(error, dispatch)
)

export const editVideoComment = data => ({
  type: 'EDIT_VIDEO_COMMENT',
  data
})

export const editVideoCommentAsync = (editedComment, commentId, cb) => dispatch =>
request.post(`${API_URL}/comments/edit`, {editedComment, commentId}, auth())
.then(
  response => {
    const { data } = response;
    if (data.success) {
      dispatch(editVideoComment({editedComment, commentId}));
      cb();
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const deleteVideoComment = data => ({
  type: 'DELETE_VIDEO_COMMENT',
  data
})

export const deleteVideoCommentAsync = commentId => dispatch =>
request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
.then(
  response => {
    const { data } = response;
    if (data.success) {
      dispatch(deleteVideoComment({commentId}));
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const likeVideoComment = data => ({
  type: 'VIDEO_COMMENT_LIKE',
  data
})

export const likeVideoCommentAsync = commentId => dispatch =>
request.post(`${API_URL}/comments/like`, {commentId}, auth())
.then(
  response => {
    const { data } = response;
    if (data.likes) {
      dispatch(likeVideoComment({commentId, likes: data.likes}))
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const uploadVideoReply = data => ({
  type: 'UPLOAD_VIDEO_REPLY',
  data
})

export const uploadVideoReplyAsync = (reply, commentId, videoId) => dispatch =>
request.post(`${API_URL}/replies`, {reply, commentId, videoId}, auth())
.then(
  response => {
    const { data } = response;
    if (data.result) {
      dispatch(uploadVideoReply({commentId, reply: data.result}))
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const editVideoReply = data => ({
  type: 'EDIT_VIDEO_REPLY',
  data
})

export const editVideoReplyAsync = ({editedReply, replyId, commentId}, cb) => dispatch =>
request.post(`${API_URL}/replies/edit`, {editedReply, replyId}, auth())
.then(
  response => {
    const { data } = response;
    if (data.success) {
      dispatch(editVideoReply({editedReply, replyId, commentId}));
      cb();
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const deleteVideoReply = data => ({
  type: 'DELETE_VIDEO_REPLY',
  data
})

export const deleteVideoReplyAsync = (replyId, commentId) => dispatch =>
request.delete(`${API_URL}/replies?replyId=${replyId}`, auth())
.then(
  response => {
    const { data } = response;
    if (data.success) {
      dispatch(deleteVideoReply({replyId, commentId}))
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const likeVideoReply = data => ({
  type: 'VIDEO_REPLY_LIKE',
  data
})

export const likeVideoReplyAsync = (replyId, commentId) => dispatch =>
request.post(`${API_URL}/replies/like`, {replyId, commentId}, auth())
.then(
  response => {
    const { data } = response;
    if (data.likes) {
      dispatch(likeVideoReply({replyId, commentId, likes: data.likes}))
    }
    return;
  }
).catch(
  error => handleError(error, dispatch)
)

export const uploadQuestions = data => ({
  type: 'UPLOAD_QUESTIONS',
  data
})

export const uploadQuestionsAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/questions`, params, auth())
.then(
  response => {
    const { data } = response;
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
).catch(
  error => handleError(error, dispatch)
)

export const openAddVideoModal = () => ({
  type: 'VID_MODAL_OPEN'
})

export const closeAddVideoModal = () => ({
  type: 'VID_MODAL_CLOSE'
})

export const resetVideoPage = () => ({
  type: 'RESET_VIDEO_PAGE'
})

export const resetVideoState = () => ({
  type: 'RESET_VID_STATE'
})

function handleError(error, dispatch) {
  if (error.data === 'Unauthorized') {
    dispatch(logout());
    dispatch(openSigninModal());
  } else {
    console.error(error);
  }
}
