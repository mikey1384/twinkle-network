import request from 'axios'
import { auth, handleError } from 'helpers/apiHelpers'
import { URL } from 'constants/URL'
import { processedQueryString } from 'helpers/stringHelpers'
import FEED from '../constants/Feed'

const API_URL = `${URL}/feed`

export const attachStar = data => ({
  type: FEED.ATTACH_STAR,
  data
})

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
    handleError(error, dispatch)
  }
}

export const questionFeedLike = contentId => async dispatch => {
  try {
    const {
      data: { likes }
    } = await request.post(
      `${URL}/content/question/like`,
      { contentId },
      auth()
    )
    dispatch({
      type: FEED.LIKE_CONTENT,
      data: { rootType: 'question', contentId, likes }
    })
  } catch (error) {
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
    return Promise.resolve()
  } catch (error) {
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
    handleError(error, dispatch)
  }
}

export const feedRewardCommentEdit = ({ id, text }) => ({
  type: FEED.EDIT_REWARD_COMMENT,
  id,
  text
})

export const feedVideoStar = videoId => async dispatch => {
  try {
    const { data } = await request.put(`${URL}/video/star`, { videoId }, auth())
    return dispatch({
      type: FEED.STAR_VIDEO,
      videoId,
      isStarred: data
    })
  } catch (error) {
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
      `${URL}/content/feed?${processedQueryString(query)}`
    )
    dispatch({
      type: FEED.LOAD_DETAIL,
      id: feed.feedId,
      data: {
        ...data,
        childComments: [],
        commentsShown: false,
        commentsLoadMoreButton: false,
        isReply: false
      }
    })
  } catch (error) {
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
    handleError(error, dispatch)
  }
}

export const fetchNewFeeds = ({
  latestTS,
  shownFeeds,
  userId
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/new?latestTS=${latestTS}&userId=${userId}&${shownFeeds}`
    )
    dispatch({
      type: FEED.LOAD_NEW,
      data
    })
  } catch (error) {
    handleError(error, dispatch)
  }
}

export const fetchMoreFeeds = ({
  shownFeeds,
  filter = 'all'
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}?filter=${filter}${shownFeeds ? `&${shownFeeds}` : ''}`
    )
    dispatch({
      type: FEED.LOAD_MORE,
      data,
      filter
    })
    return Promise.resolve()
  } catch (error) {
    handleError(error, dispatch)
  }
}

export const fetchUserFeeds = ({ username, type }) => async dispatch => {
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
    handleError(error, dispatch)
  }
}

export const fetchMoreUserFeeds = ({
  username,
  type,
  shownFeeds
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/user/?username=${username}&type=${type}${
        shownFeeds ? `&${shownFeeds}` : ''
      }`
    )
    dispatch({
      type: FEED.LOAD_MORE,
      data
    })
    return Promise.resolve()
  } catch (error) {
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
      type: FEED.LIKE_COMMENT,
      data: { contentId, likes: data.likes }
    })
  } catch (error) {
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
      type: FEED.LOAD_COMMENTS,
      data: { isReply, type, contentId, childComments: data }
    })
    return Promise.resolve()
  } catch (error) {
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
    handleError(error, dispatch)
  }
}

export const uploadFeedComment = (comment, parent) => async dispatch => {
  console.log(comment, parent)
  try {
    const { data } = await request.post(
      `${API_URL}/comments`,
      { comment, parent },
      auth()
    )
    dispatch({
      type: FEED.UPLOAD_COMMENT,
      data: {
        ...data,
        type: parent.type,
        contentId: parent.id
      }
    })
  } catch (error) {
    handleError(error, dispatch)
  }
}

export const uploadFeedReply = ({
  replyContent,
  comment,
  parent,
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
        contentId: parent.id,
        reply: {
          ...data,
          originType,
          replies: []
        },
        commentId: comment.id
      }
    })
  } catch (error) {
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
    handleError(error, dispatch)
  }
}
