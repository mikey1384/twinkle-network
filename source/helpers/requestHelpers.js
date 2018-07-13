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

export const deleteContent = async({ id, type, handleError }) => {
  try {
    await request.delete(`${URL}/content?contentId=${id}&type=${type}`, auth())
    return Promise.resolve()
  } catch (error) {
    handleError(error)
  }
}

export const editContent = async({ params, handleError }) => {
  try {
    const { data } = await request.put(`${URL}/content`, params, auth())
    return Promise.resolve(data)
  } catch (error) {
    handleError(error)
  }
}

export const likeContent = async({ id, type, handleError }) => {
  try {
    const {
      data: { likes }
    } = await request.post(`${URL}/content/like`, { id, type }, auth())
    return Promise.resolve(likes)
  } catch (error) {
    handleError(error)
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
