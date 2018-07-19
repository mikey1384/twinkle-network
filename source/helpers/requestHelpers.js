/* global localStorage */
import { logout, openSigninModal } from 'redux/actions/UserActions'
import request from 'axios'
import { URL } from 'constants/URL'

export const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null

export const auth = () => ({
  headers: {
    authorization: token()
  }
})

export function handleError(error, dispatch) {
  if (error.response) {
    const { status } = error.response
    if (status === 401) {
      dispatch(logout())
      dispatch(openSigninModal())
    }
    if (status === 301) {
      window.location.reload()
    }
  }
  console.error(error.response || error)
}

export const deleteContent = async({ id, type, dispatch }) => {
  try {
    await request.delete(`${URL}/content?contentId=${id}&type=${type}`, auth())
    return Promise.resolve()
  } catch (error) {
    handleError(error, dispatch)
  }
}

export const editContent = async({
  params: {
    contentId,
    editedComment,
    editedContent,
    editedDescription,
    editedTitle,
    editedUrl,
    type
  },
  dispatch
}) => {
  try {
    const { data } = await request.put(
      `${URL}/content`,
      {
        contentId,
        editedComment,
        editedContent,
        editedDescription,
        editedTitle,
        editedUrl,
        type
      },
      auth()
    )
    return Promise.resolve(data)
  } catch (error) {
    handleError(error, dispatch)
  }
}

export const likeContent = async({ id, type, dispatch }) => {
  try {
    const {
      data: { likes }
    } = await request.post(`${URL}/content/like`, { id, type }, auth())
    return Promise.resolve(likes)
  } catch (error) {
    handleError(error, dispatch)
  }
}

export const loadComments = async({ id, type, lastCommentId, limit }) => {
  try {
    const { data } = await request.get(
      `${URL}/content/comments?contentId=${id}&type=${type}&lastCommentId=${lastCommentId}&limit=${limit}`
    )
    return Promise.resolve(data)
  } catch (error) {
    console.error(error.response || error)
  }
}

export const loadNewFeeds = async({ lastInteraction }) => {
  try {
    const { data } = await request.get(
      `${URL}/content/newFeeds?lastInteraction=${lastInteraction}`
    )
    return Promise.resolve(data)
  } catch (error) {
    console.error(error.response || error)
  }
}

export const uploadComment = async({
  content,
  parent,
  rootCommentId,
  targetCommentId,
  dispatch
}) => {
  try {
    const { data } = await request.post(
      `${URL}/content/comments`,
      { content, parent, rootCommentId, targetCommentId },
      auth()
    )
    return Promise.resolve(data)
  } catch (error) {
    handleError(error, dispatch)
  }
}
