import request from 'axios'
import {push} from 'react-router-redux'
import {likePlaylistVideo} from './PlaylistActions'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/video`

export const getVideos = (videos, initialRun) => ({
  type: 'GET_VIDEOS',
  initialRun,
  videos: videos
})

export const getInitialVideos = () => dispatch => request.get(API_URL).then(
  response => dispatch(getVideos(response.data, true))
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const addVideoViewAsync = params => dispatch =>
request.post(`${API_URL}/view`, params)
.catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const clearSearchResults = () => ({
  type: 'CLEAR_CONTENT_SEARCH_RESULTS'
})

export const closeAddVideoModal = () => ({
  type: 'VID_MODAL_CLOSE'
})

export const deleteVideo = (arrayIndex, data) => ({
  type: 'DELETE_VIDEO',
  arrayIndex,
  data
})

export const deleteVideoAsync = ({videoId, arrayIndex, lastVideoId}) => dispatch =>
request.delete(`${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`, auth())
.then(
  response => {
    const {data} = response
    if (data.result) {
      if (!lastVideoId) {
        dispatch(getInitialVideos())
        dispatch(push('/videos'))
      } else {
        dispatch(deleteVideo(arrayIndex, data.result))
      }
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const deleteVideoComment = data => ({
  type: 'DELETE_VIDEO_COMMENT',
  data
})

export const deleteVideoCommentAsync = commentId => dispatch =>
request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
.then(
  response => {
    const {data} = response
    if (data.success) {
      dispatch(deleteVideoComment({commentId}))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const deleteVideoDebate = (discussionId, callback) => dispatch =>
request.delete(`${API_URL}/debates?discussionId=${discussionId}`, auth())
.then(
  response => dispatch({
    type: 'DELETE_VIDEO_DEBATE',
    discussionId
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const editVideoComment = data => ({
  type: 'EDIT_VIDEO_COMMENT',
  data
})

export const editVideoCommentAsync = ({editedComment, commentId}, cb) => dispatch =>
request.post(`${API_URL}/comments/edit`, {editedComment, commentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.success) {
      dispatch(editVideoComment({editedComment, commentId}))
      cb()
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const editVideoDebate = (discussionId, editedTitle, editedDescription, callback) => dispatch =>
request.post(`${API_URL}/debates/edit`, {discussionId, editedTitle, editedDescription}, auth())
.then(
  response => {
    dispatch({
      type: 'EDIT_VIDEO_DEBATE',
      data: response.data,
      discussionId
    })
    callback()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const editVideoPage = params => ({
  type: 'EDIT_VIDEO_PAGE',
  params
})

export const editVideoPageAsync = (params, sender) => dispatch =>
request.post(`${API_URL}/edit/page`, params, auth())
.then(
  response => {
    const {data} = response
    if (data.success) {
      dispatch(editVideoPage(params))
      sender.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
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
    const {data} = response
    if (data.result) {
      dispatch(editVideoTitle(params.videoId, data.result))
      sender.setState({onEdit: false})
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const getMoreVideos = videoId => dispatch =>
request.get(`${API_URL}?videoId=${videoId}`)
.then(
  response => {
    dispatch(getVideos(response.data, false))
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const likeVideoAsync = videoId => dispatch =>
request.post(`${API_URL}/like`, {contentId: videoId}, auth())
.then(
  response => {
    const {data} = response
    if (data.likes) {
      dispatch({
        type: 'VIDEO_LIKE',
        data: data.likes,
        videoId
      })
      dispatch(likePlaylistVideo(data.likes, videoId))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const likeVideoComment = commentId => dispatch =>
request.post(`${API_URL}/comments/like`, {commentId}, auth())
.then(
  response => dispatch({
    type: 'VIDEO_COMMENT_LIKE',
    data: {...response.data, commentId}
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreCommentsAsync = (videoId, lastCommentId) => dispatch =>
request.get(`${API_URL}/comments?rootId=${videoId}&lastCommentId=${lastCommentId}&rootType=video`)
.then(
  response => dispatch({
    type: 'LOAD_MORE_COMMENTS',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreReplies = (lastReplyId, commentId, type) => dispatch =>
request.get(`${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}`)
.then(
  response => dispatch({
    type: 'LOAD_MORE_REPLIES',
    data: response.data,
    commentId,
    commentType: type
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreDebateComments = (lastCommentId, discussionId) => dispatch =>
request.get(`${API_URL}/debates/comments?discussionId=${discussionId}&lastCommentId=${lastCommentId}`)
.then(
  response => dispatch({
    type: 'LOAD_MORE_VIDEO_DEBATE_COMMENTS',
    data: response.data,
    discussionId
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreDebates = (videoId, lastDiscussionId) => dispatch =>
request.get(`${API_URL}/debates?videoId=${videoId}&lastDiscussionId=${lastDiscussionId}`)
.then(
  response => dispatch({
    type: 'LOAD_MORE_VIDEO_DEBATES',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadVideoCommentsAsync = videoId => dispatch =>
request.get(`${API_URL}/comments?rootId=${videoId}&rootType=video`)
.then(
  response => {
    dispatch({
      type: 'LOAD_VIDEO_COMMENTS',
      data: response.data
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadVideoDebates = videoId => dispatch =>
request.get(`${API_URL}/debates?videoId=${videoId}`)
.then(
  response => dispatch({
    type: 'LOAD_VIDEO_DEBATES',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadVideoDebateComments = (discussionId) => dispatch =>
request.get(`${API_URL}/debates/comments?discussionId=${discussionId}`)
.then(
  response => dispatch({
    type: 'LOAD_VIDEO_DEBATE_COMMENTS',
    discussionId,
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadVideoPage = data => ({
  type: 'LOAD_VIDEO_PAGE',
  data
})

export const loadVideoPageAsync = (videoId, fromClientSide, callback) => dispatch => {
  if (isNaN(videoId)) return dispatch({type: 'VIDEO_PAGE_UNAVAILABLE'})
  if (!fromClientSide) dispatch({type: 'VIDEO_PAGE_LOADING_SHOW'})
  request.get(`${API_URL}/loadPage?videoId=${videoId}`)
  .then(
    response => {
      dispatch(loadVideoPage(response.data))
      dispatch(loadVideoDebates(videoId))
      if (callback) callback()
    }
  ).catch(
    error => {
      dispatch({type: 'VIDEO_PAGE_UNAVAILABLE'})
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const loadVideoPageFromClientSideAsync = (videoId, to) =>
dispatch => dispatch(loadVideoPageAsync(videoId, true, dispatch(push(`/${to}`))))

export const openAddVideoModal = () => ({
  type: 'VID_MODAL_OPEN'
})

export const resetVideoPage = () => ({
  type: 'RESET_VIDEO_PAGE'
})

export const resetVideoState = () => ({
  type: 'RESET_VID_STATE'
})

export const searchVideoAsync = text => dispatch =>
request.get(`${API_URL}/search?query=${text}`)
.then(
  response => dispatch({
    type: 'SEARCH_CONTENT',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadQuestions = data => ({
  type: 'UPLOAD_QUESTIONS',
  data
})

export const uploadQuestionsAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/questions`, params, auth())
.then(
  response => {
    const {data} = response
    if (data.success) {
      const questions = params.questions.map(question => {
        return {
          title: question.title,
          choices: [
            question.choice1,
            question.choice2,
            question.choice3,
            question.choice4,
            question.choice5
          ],
          correctChoice: question.correctChoice
        }
      })
      dispatch(uploadQuestions(questions))
      callback()
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadVideo = data => ({
  type: 'UPLOAD_VIDEO',
  data
})

export const uploadVideoAsync = params => dispatch =>
request.post(API_URL, params, auth())
.then(
  response => {
    const {data} = response
    if (data.result) {
      dispatch(uploadVideo([data.result]))
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadVideoComment = data => ({
  type: 'UPLOAD_VIDEO_COMMENT',
  data
})

export const uploadVideoCommentAsync = (comment, videoId) => dispatch =>
request.post(`${API_URL}/comments`, {content: comment, rootId: videoId, rootType: 'video'}, auth())
.then(
  response => {
    const {data} = response
    dispatch(uploadVideoComment(data))
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadVideoDebate = (title, description, videoId) => dispatch =>
request.post(`${API_URL}/debates`, {title, description, videoId}, auth())
.then(
  response => dispatch({
    type: 'UPLOAD_VIDEO_DEBATE',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadVideoDebateComment = ({
  comment, videoId: rootId, discussionId, discussionTitle
}) => dispatch =>
request.post(`${API_URL}/debates/comments`, {comment, rootId, rootType: 'video', discussionId}, auth())
.then(
  response => dispatch({
    type: 'UPLOAD_VIDEO_DEBATE_COMMENT',
    data: {...response.data, discussionTitle}
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadVideoDebateReply = ({
  replyContent, comment, videoId: rootId,
  replyOfReply, originType
}) => dispatch => {
  const params = {
    content: replyContent,
    rootId,
    commentId: comment.commentId || comment.id,
    replyId: comment.commentId ? comment.id : null,
    addedFromPanel: true
  }

  request.post(`${API_URL}/replies`, params, auth())
  .then(
    response => dispatch({
      type: 'UPLOAD_VIDEO_REPLY',
      replyType: {
        forDiscussionPanel: true,
        replyOfReply,
        originType
      },
      data: response.data.result
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const uploadVideoReplyAsync = ({
  reply, commentId, videoId: rootId, replyId, replyOfReply
}) => dispatch => request.post(`${API_URL}/replies`, {content: reply, rootId, replyId, commentId}, auth())
.then(
  response => {
    const {data} = response
    if (data.result) {
      dispatch({
        type: 'UPLOAD_VIDEO_REPLY',
        replyType: {replyOfReply},
        data: data.result
      })
    }
    return
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)
