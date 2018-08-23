import request from 'axios'
import { auth, handleError } from 'helpers/requestHelpers'
import { URL } from 'constants/URL'
import FEED from '../constants/Feed'

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

export const feedCommentEdit = ({ editedComment, commentId }) => ({
  type: FEED.EDIT_COMMENT,
  commentId,
  editedComment
})

export const feedContentEdit = ({ data, contentType, contentId }) => ({
  type: FEED.EDIT_CONTENT,
  data,
  contentType,
  contentId
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

export const fetchFeeds = ({
  filter = 'all',
  username
} = {}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${URL}/content/feeds?filter=${filter}&username=${username}`
    )
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

export const fetchNewFeeds = data => ({
  type: FEED.LOAD_NEW,
  data
})

export const fetchMoreFeeds = ({
  shownFeeds,
  filter,
  username
}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${URL}/content/feeds?filter=${filter}&username=${username}${
        shownFeeds ? `&${shownFeeds}` : ''
      }`
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

export const setCurrentSection = section => ({
  type: FEED.SET_SECTION,
  section
})

export const showFeedComments = (data, feedId) => ({
  type: FEED.LOAD_COMMENTS,
  data,
  feedId
})

export const uploadContent = params => async dispatch => {
  try {
    const { data } = await request.post(`${URL}/content`, params, auth())
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

export const uploadTargetContentComment = (data, feedId) => ({
  type: FEED.UPLOAD_TC_COMMENT,
  data,
  feedId
})
