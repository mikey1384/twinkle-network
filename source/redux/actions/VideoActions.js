import request from 'axios'
import { push } from 'react-router-redux'
import { likePlaylistVideo } from './PlaylistActions'
import { auth, handleError } from '../constants'
import { URL } from 'constants/URL'
import VIDEO from '../constants/Video'

const API_URL = `${URL}/video`

export const getInitialVideos = () => async dispatch => {
  try {
    const { data } = await request.get(API_URL)
    dispatch({
      type: VIDEO.LOAD,
      initialRun: true,
      videos: data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const addVideoView = params => dispatch => {
  try {
    request.post(`${API_URL}/view`, params)
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const closeAddVideoModal = () => ({
  type: VIDEO.CLOSE_MODAL
})

export const deleteVideo = ({
  videoId,
  arrayIndex,
  lastVideoId
}) => async dispatch => {
  try {
    const { data } = await request.delete(
      `${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`,
      auth()
    )
    if (!lastVideoId) {
      dispatch(getInitialVideos())
      dispatch(push('/videos'))
    } else {
      dispatch({
        type: VIDEO.DELETE,
        arrayIndex,
        data: data.result
      })
    }
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const deleteVideoComment = commentId => async dispatch => {
  try {
    await request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
    dispatch({
      type: VIDEO.DELETE_COMMENT,
      data: { commentId }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const deleteVideoDiscussion = (
  discussionId,
  callback
) => async dispatch => {
  try {
    await request.delete(
      `${API_URL}/discussions?discussionId=${discussionId}`,
      auth()
    )
    dispatch({
      type: VIDEO.DELETE_DISCUSSION,
      discussionId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editVideoComment = params => async dispatch => {
  try {
    const { data } = await request.put(`${API_URL}/comments`, params, auth())
    dispatch({
      type: VIDEO.EDIT_COMMENT,
      ...data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editVideoDiscussion = (
  discussionId,
  editedTitle,
  editedDescription,
  callback
) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/discussions/edit`,
      { discussionId, editedTitle, editedDescription },
      auth()
    )
    dispatch({
      type: VIDEO.EDIT_DISCUSSION,
      data,
      discussionId
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editVideoPage = params => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/edit/page`, params, auth())
    if (data.success) {
      dispatch({
        type: VIDEO.EDIT_PAGE,
        params
      })
    }
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editVideoTitle = params => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/edit/title`, params, auth())
    if (data.result) {
      dispatch({
        type: VIDEO.EDIT_TITLE,
        videoId: params.videoId,
        data: data.result
      })
    }
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const emptyCurrentVideoSlot = () => ({
  type: VIDEO.EMPTY_CURRENT_VIDEO_SLOT
})

export const fillCurrentVideoSlot = videoId => ({
  type: VIDEO.FILL_CURRENT_VIDEO_SLOT,
  videoId
})

export const getMoreVideos = videoId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?videoId=${videoId}`)
    dispatch({
      type: VIDEO.LOAD,
      initialRun: false,
      videos: data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const likeVideo = videoId => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/like`,
      { contentId: videoId },
      auth()
    )
    dispatch({
      type: VIDEO.LIKE,
      data: data.likes,
      videoId
    })
    dispatch(likePlaylistVideo(data.likes, videoId))
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const likeVideoComment = commentId => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/comments/like`,
      { commentId },
      auth()
    )
    dispatch({
      type: VIDEO.LIKE_COMMENT,
      data: { ...data, commentId }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMoreComments = ({
  videoId,
  lastCommentId
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/comments?rootId=${videoId}&lastCommentId=${lastCommentId}&rootType=video`
    )
    dispatch({
      type: VIDEO.LOAD_MORE_COMMENTS,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMoreReplies = (
  lastReplyId,
  commentId,
  type
) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=video`
    )
    dispatch({
      type: VIDEO.LOAD_MORE_REPLIES,
      data,
      commentId,
      commentType: type
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMoreDiscussionComments = ({
  lastCommentId,
  discussionId
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/discussions/comments?discussionId=${discussionId}&lastCommentId=${lastCommentId}`
    )
    dispatch({
      type: VIDEO.LOAD_MORE_DISCUSSION_COMMENTS,
      data,
      discussionId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMoreDiscussions = (
  videoId,
  lastDiscussionId
) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/discussions?videoId=${videoId}&lastDiscussionId=${lastDiscussionId}`
    )
    dispatch({
      type: VIDEO.LOAD_MORE_DISCUSSIONS,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMorePlaylistVideos = (
  videoId,
  playlistId,
  shownVideos
) => async dispatch => {
  try {
    const {
      data: { playlistVideos, playlistVideosLoadMoreShown }
    } = await request.get(
      `${API_URL}/more/playlistVideos?videoId=${videoId}&playlistId=${playlistId}&${shownVideos}`
    )
    dispatch({
      type: VIDEO.LOAD_MORE_RIGHT_MENU_PL_VIDS,
      playlistVideos,
      playlistVideosLoadMoreShown
    })
    Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadRightMenuVideos = (videoId, playlistId) => async dispatch => {
  try {
    const { data } = await request.get(
      `${URL}/${
        playlistId ? 'playlist' : 'video'
      }/rightMenu?videoId=${videoId}${
        playlistId ? `&playlistId=${playlistId}` : ''
      }`
    )
    dispatch({
      type: VIDEO.LOAD_RIGHT_MENU_VIDS,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadVideoComments = videoId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/comments?rootId=${videoId}&rootType=video`
    )
    dispatch({
      type: VIDEO.LOAD_COMMENTS,
      data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadVideoDiscussions = videoId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/discussions?videoId=${videoId}`
    )
    dispatch({
      type: VIDEO.LOAD_DISCUSSIONS,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadVideoDiscussionComments = discussionId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/discussions/comments?discussionId=${discussionId}`
    )
    dispatch({
      type: VIDEO.LOAD_DISCUSSION_COMMENTS,
      discussionId,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadVideoPage = (videoId, fromClientSide) => async dispatch => {
  if (isNaN(videoId)) return dispatch({ type: VIDEO.PAGE_UNAVAILABLE })
  try {
    const { data } = await request.get(`${API_URL}/page?videoId=${videoId}`)
    dispatch({
      type: VIDEO.LOAD_PAGE,
      data
    })
    dispatch(loadVideoDiscussions(videoId))
    return Promise.resolve()
  } catch (error) {
    dispatch({ type: VIDEO.PAGE_UNAVAILABLE })
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const openAddVideoModal = () => ({
  type: VIDEO.OPEN_MODAL
})

export const resetVideoPage = () => ({
  type: VIDEO.RESET_PAGE
})

export const resetVideoState = () => ({
  type: VIDEO.RESET
})

export const starVideo = videoId => async dispatch => {
  try {
    const { data } = await request.put(`${API_URL}/star`, { videoId }, auth())
    return dispatch({
      type: VIDEO.STAR,
      videoId,
      isStarred: data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadQuestions = params => async dispatch => {
  try {
    await request.post(`${API_URL}/questions`, params, auth())
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
    dispatch({
      type: VIDEO.ADD_QUESTIONS,
      data: questions
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadVideo = params => async dispatch => {
  try {
    const { data } = await request.post(API_URL, params, auth())
    dispatch({
      type: VIDEO.UPLOAD,
      data: [data.result]
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadVideoComment = (comment, videoId) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/comments`,
      { content: comment, rootId: videoId, rootType: 'video' },
      auth()
    )
    dispatch({
      type: VIDEO.UPLOAD_COMMENT,
      comment: data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadVideoDiscussion = (
  title,
  description,
  videoId
) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/discussions`,
      { title, description, videoId },
      auth()
    )
    dispatch({
      type: VIDEO.UPLOAD_DISCUSSION,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadVideoDiscussionComment = ({
  comment,
  videoId: rootId,
  discussionId,
  discussionTitle
}) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/discussions/comments`,
      {
        content: comment,
        rootId,
        rootType: 'video',
        discussionId
      },
      auth()
    )
    dispatch({
      type: VIDEO.UPLOAD_DISCUSSION_COMMENT,
      data: { ...data, discussionTitle }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadVideoDiscussionReply = ({
  replyContent,
  comment,
  videoId: rootId,
  discussionId,
  replyOfReply,
  originType
}) => async dispatch => {
  const params = {
    content: replyContent,
    rootId,
    rootType: 'video',
    commentId: comment.commentId || comment.id,
    replyId: comment.commentId ? comment.id : null,
    discussionId
  }

  try {
    const { data } = await request.post(`${API_URL}/replies`, params, auth())
    dispatch({
      type: VIDEO.UPLOAD_REPLY,
      replyType: {
        forDiscussionPanel: true,
        replyOfReply,
        originType
      },
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadVideoReply = ({
  reply,
  commentId,
  videoId: rootId,
  replyId,
  replyOfReply
}) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/replies`,
      {
        content: reply,
        rootId,
        replyId,
        commentId,
        rootType: 'video'
      },
      auth()
    )
    dispatch({
      type: VIDEO.UPLOAD_REPLY,
      replyType: { replyOfReply },
      data
    })
    return
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}
