import request from 'axios'
import { auth, handleError } from '../constants'
import { URL } from 'constants/URL'
import { push } from 'react-router-redux'
import LINK from '../constants/Link'

const API_URL = `${URL}/url`

export const attachStar = data => ({
  type: LINK.ATTACH_STAR,
  data
})

export const likeComment = commentId => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/comments/like`,
      { commentId },
      auth()
    )
    if (data.likes) {
      dispatch({
        type: LINK.LIKE_COMMENT,
        data: { contentId: commentId, likes: data.likes }
      })
    }
    return
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const deleteComment = commentId => async dispatch => {
  try {
    await request.delete(`${API_URL}/comments?commentId=${commentId}`, auth())
    dispatch({
      type: LINK.DELETE_COMMENT,
      commentId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const deleteLink = linkId => async dispatch => {
  try {
    await request.delete(`${API_URL}?linkId=${linkId}`, auth())
    dispatch({
      type: LINK.DELETE,
      linkId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const deleteLinkFromPage = linkId => async dispatch => {
  try {
    await request.delete(`${API_URL}/?linkId=${linkId}`, auth())
    dispatch(push('/links'))
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editComment = params => async dispatch => {
  try {
    const { data } = await request.put(`${API_URL}/comments`, params, auth())
    dispatch({
      type: LINK.EDIT_COMMENT,
      ...data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editRewardComment = ({ id, text }) => ({
  type: LINK.EDIT_REWARD_COMMENT,
  id,
  text
})

export const editLinkPage = params => async dispatch => {
  try {
    await request.put(`${API_URL}/page`, params, auth())
    dispatch({
      type: LINK.EDIT_PAGE,
      data: params
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const editTitle = params => async dispatch => {
  try {
    await request.put(`${API_URL}/title`, params, auth())
    dispatch({
      type: LINK.EDIT_TITLE,
      data: params
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchLinks = () => async dispatch => {
  try {
    const { data } = await request.get(API_URL)
    dispatch({
      type: LINK.LOAD,
      links: data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchMoreLinks = linkId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?linkId=${linkId}`)
    dispatch({
      type: LINK.LOAD_MORE,
      links: data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchComments = linkId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/comments?rootId=${linkId}&rootType=url`
    )
    dispatch({
      type: LINK.LOAD_COMMENTS,
      data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchMoreComments = (linkId, lastCommentId) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/comments?rootId=${linkId}&lastCommentId=${lastCommentId}&rootType=url`
    )
    dispatch({
      type: LINK.LOAD_MORE_COMMENTS,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const fetchMoreReplies = (lastReplyId, commentId) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/replies?lastReplyId=${lastReplyId}&commentId=${commentId}&rootType=url`
    )
    dispatch({
      type: LINK.LOAD_MORE_REPLIES,
      data,
      commentId
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const likeLink = linkId => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/like`,
      { contentId: linkId },
      auth()
    )
    dispatch({
      type: LINK.LIKE,
      likes: data.likes
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const loadLinkPage = linkId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}/page?linkId=${linkId}`)
    dispatch({
      type: LINK.LOAD_PAGE,
      page: data
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const resetPage = () => ({
  type: LINK.RESET_PAGE
})

export const submitReply = ({
  replyContent,
  comment,
  parent,
  replyOfReply
}) => async dispatch => {
  const params = {
    content: replyContent,
    rootId: parent.id,
    rootType: 'url',
    commentId: comment.commentId || comment.id,
    replyId: comment.commentId ? comment.id : null
  }
  try {
    const { data } = await request.post(`${API_URL}/replies`, params, auth())
    dispatch({
      type: LINK.UPLOAD_REPLY,
      data: {
        reply: {
          ...data,
          replyOfReply,
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

export const submitComment = ({
  content,
  linkId: rootId
}) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/comments`,
      { content, rootId, rootType: 'url' },
      auth()
    )
    dispatch({
      type: LINK.UPLOAD_COMMENT,
      comment: data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const uploadLink = ({ url, title, description }) => async dispatch => {
  try {
    const { data: linkItem } = await request.post(
      `${API_URL}`,
      { url, title, description },
      auth()
    )
    dispatch({
      type: LINK.UPLOAD,
      linkItem
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}
