import request from 'axios'
import { auth, handleError } from 'helpers/requestHelpers'
import { URL } from 'constants/URL'
import FEED from '../constants/Feed'

const API_URL = `${URL}/feed`

export const attachStar = data => ({
  type: FEED.ATTACH_STAR,
  data
})

export const clearFeeds = () => ({
  type: FEED.CLEAR
})

export const contentFeedLike = ({ likes, contentId, type }) => ({
  type: FEED.LIKE_CONTENT,
  data: { contentId, type, likes }
})

export const feedCommentDelete = commentId => ({
  type: FEED.DELETE_COMMENT,
  commentId
})

export const feedContentDelete = ({ type, contentId }) => ({
  type: FEED.DELETE_CONTENT,
  contentType: type,
  contentId
})

export const feedCommentEdit = data => ({
  type: FEED.EDIT_COMMENT,
  ...data
})

export const feedContentEdit = (data, params) => ({
  type: FEED.EDIT_CONTENT,
  contentType: params.type,
  contentId: params.contentId,
  editedTitle: data.title,
  editedDescription: data.description,
  editedUrl: data.content
})

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

export const fetchFeed = ({ data, feedId }) => ({
  type: FEED.LOAD_DETAIL,
  feedId,
  data
})

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

export const loadMoreFeedComments = ({ data, contentType, feedId }) => ({
  type: FEED.LOAD_MORE_COMMENTS,
  contentType,
  feedId,
  data
})

export const loadMoreFeedReplies = (data, feedId) => ({
  type: FEED.LOAD_MORE_REPLIES,
  feedId,
  data
})

export const showFeedComments = (data, feedId) => ({
  type: FEED.LOAD_COMMENTS,
  data,
  feedId
})

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

export const uploadFeedComment = ({ data, type, contentId }) => ({
  type: FEED.UPLOAD_COMMENT,
  comment: data,
  contentType: type,
  contentId
})

export const uploadFeedReply = data => ({
  type: FEED.UPLOAD_REPLY,
  data
})

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
