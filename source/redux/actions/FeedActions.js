import request from 'axios'
import { auth, handleError } from '../constants'
import { URL } from 'constants/URL'
import { processedQueryString } from 'helpers/stringHelpers'
import FEED from '../constants/Feed'

const API_URL = `${URL}/feed`

export const clearFeeds = () => ({
  type: FEED.CLEAR
})

export const commentFeedLike = commentId => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/comments/like`,
      { commentId },
      auth()
    )
    dispatch({
      type: FEED.LIKE_COMMENT,
      data: { contentId: commentId, likes: data.likes }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const contentFeedLike = (contentId, rootType) => async dispatch => {
  try {
    const { data } = await request.post(
      `${URL}/${rootType}/like`,
      { contentId },
      auth()
    )
    dispatch({
      type: FEED.LIKE_CONTENT,
      data: { contentId, rootType, likes: data.likes }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const questionFeedLike = contentId => async dispatch => {
  try {
    const { data: { likes } } = await request.post(
      `${URL}/content/question/like`,
      { contentId },
      auth()
    )
    dispatch({
      type: FEED.LIKE_QUESTION,
      data: { contentId, likes }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const feedCommentDelete = commentId => async dispatch => {
  try {
    await request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
    dispatch({
      type: FEED.DELETE_COMMENT,
      commentId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const feedContentDelete = ({ type, contentId }) => async dispatch => {
  try {
    await request.delete(
      `${URL}/content?contentId=${contentId}&type=${type}`,
      auth()
    )
    if (type === 'comment') {
      return dispatch({
        type: FEED.DELETE_COMMENT,
        commentId: contentId
      })
    }
    dispatch({
      type: FEED.DELETE_CONTENT,
      contentType: type,
      contentId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const feedCommentEdit = params => async dispatch => {
  try {
    const { data } = await request.put(`${API_URL}/comments`, params, auth())
    dispatch({
      type: FEED.EDIT_COMMENT,
      ...data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const feedContentEdit = params => async dispatch => {
  try {
    const { data } = await request.put(`${URL}/content`, params, auth())
    switch (params.type) {
      case 'comment':
        dispatch({
          type: FEED.EDIT_COMMENT,
          commentId: params.contentId,
          editedComment: data.content
        })
        break
      case 'discussion':
        dispatch({
          type: FEED.EDIT_DISCUSSION,
          contentId: params.contentId,
          editedTitle: data.title,
          editedDescription: data.description
        })
        break
      case 'question':
        dispatch({
          type: FEED.EDIT_QUESTION,
          contentId: params.contentId,
          editedContent: data.content,
          editedDescription: data.description
        })
        break
      default:
        dispatch({
          type: FEED.EDIT_CONTENT,
          contentType: params.type,
          contentId: params.contentId,
          editedTitle: data.title,
          editedDescription: data.description,
          editedUrl: data.content
        })
        break
    }
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const feedVideoStar = videoId => async dispatch => {
  try {
    const { data } = await request.put(`${URL}/video/star`, { videoId }, auth())
    return dispatch({
      type: FEED.STAR_VIDEO,
      videoId,
      isStarred: data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchFeed = feed => async dispatch => {
  let query = []
  for (let key in feed) {
    query.push(`${key}=${feed[key]}&`)
  }
  query = query.join('').slice(0, -1)
  try {
    const { data } = await request.get(
      `${API_URL}/feed?${processedQueryString(query)}`
    )
    dispatch({
      type: FEED.LOAD_DETAIL,
      data: {
        ...data,
        childComments: [],
        commentsShown: false,
        commentsLoadMoreButton: false,
        isReply: false
      }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchFeeds = (filter = 'all') => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?filter=${filter}`)
    dispatch({
      type: FEED.LOAD,
      data,
      filter
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchMoreFeeds = (
  lastFeedId,
  filter = 'all'
) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}?lastFeedId=${lastFeedId}&filter=${filter}`
    )
    dispatch({
      type: FEED.LOAD_MORE,
      data,
      filter
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchUserFeeds = (username, type) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/user/?username=${username}&type=${type}`
    )
    dispatch({
      type: FEED.LOAD,
      data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchMoreUserFeeds = (
  username,
  type,
  lastId
) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/user/?username=${username}&type=${type}&lastId=${lastId}`
    )
    dispatch({
      type: FEED.LOAD_MORE,
      data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const likeTargetComment = contentId => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/comments/like`,
      { commentId: contentId },
      auth()
    )
    dispatch({
      type: FEED.LIKE_TARGET_COMMENT,
      data: { contentId, likes: data.likes }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMoreFeedComments = ({
  lastCommentId,
  type,
  contentId,
  isReply,
  rootType
}) => async dispatch => {
  try {
    const response = await request.get(
      `${API_URL}/comments?type=${type}&rootType=${rootType}&contentId=${contentId}&lastCommentId=${lastCommentId}&isReply=${isReply}`
    )
    dispatch({
      type: FEED.LOAD_MORE_COMMENTS,
      data: { type, contentId, childComments: response.data }
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadMoreFeedReplies = (
  lastReplyId,
  commentId,
  parent
) => async dispatch => {
  try {
    const response = await request.get(
      `${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=${
        parent.rootType
      }`
    )
    dispatch({
      type: FEED.LOAD_MORE_REPLIES,
      data: response.data,
      commentId,
      contentType: parent.type
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const showFeedComments = ({
  rootType,
  type,
  contentId,
  isReply
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/comments?rootType=${rootType}&type=${type}&contentId=${contentId}&isReply=${isReply}`
    )
    dispatch({
      type: FEED.SHOW_COMMENTS,
      data: { type, contentId, childComments: data }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadContent = form => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/content`, form, auth())
    return dispatch({
      type: FEED.UPLOAD_CONTENT,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadQuestion = question => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/question`, question, auth())
    return dispatch({
      type: FEED.UPLOAD_CONTENT,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadFeedComment = (comment, parent) => async dispatch => {
  const contentType = parent.type
  let commentType
  let params
  switch (contentType) {
    case 'comment':
      params = {
        content: comment,
        rootId: parent.rootId,
        rootType: parent.rootType,
        discussionId: parent.discussionId,
        commentId: parent.commentId || parent.id,
        replyId: parent.commentId ? parent.id : null
      }
      commentType = 'replies'
      break
    case 'url':
      params = { content: comment, rootId: parent.id, rootType: 'url' }
      commentType = 'comments'
      break
    case 'question':
      params = { content: comment, rootId: parent.id, rootType: 'question' }
      commentType = 'comments'
      break
    case 'video':
      params = { content: comment, rootId: parent.id, rootType: 'video' }
      commentType = 'comments'
      break
    case 'discussion':
      params = {
        content: comment,
        rootId: parent.rootId,
        rootType: parent.rootType,
        discussionId: parent.id
      }
      commentType = 'comments'
      break
    default:
      return console.error('Invalid content type')
  }

  try {
    const { data } = await request.post(
      `${API_URL}/${commentType}`,
      params,
      auth()
    )
    const action =
      contentType === 'comment'
        ? {
            type: FEED.UPLOAD_REPLY,
            data: {
              reply: { ...data, replies: [] },
              type: parent.type,
              contentId: parent.id
            }
          }
        : {
            type: FEED.UPLOAD_COMMENT,
            data: {
              ...data,
              type: parent.type,
              contentId: parent.id
            }
          }
    dispatch(action)
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadFeedReply = ({
  replyContent,
  comment,
  parent,
  replyOfReply,
  originType
}) => async dispatch => {
  const params = {
    content: replyContent,
    rootId: parent.rootId,
    rootType: parent.rootType,
    discussionId: parent.discussionId,
    commentId: comment.commentId || comment.id,
    replyId: comment.commentId ? comment.id : null
  }
  try {
    const { data } = await request.post(`${API_URL}/replies`, params, auth())
    dispatch({
      type: FEED.UPLOAD_REPLY,
      data: {
        type: parent.type,
        contentId: parent.type === 'comment' ? comment.id : parent.id,
        reply: {
          ...data,
          replyOfReply,
          originType,
          replies: []
        },
        commentId: comment.id
      }
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadTargetContentComment = (
  params,
  panelId
) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/targetContentComment`,
      params,
      auth()
    )
    dispatch({
      type: FEED.UPLOAD_TC_COMMENT,
      data,
      panelId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}
