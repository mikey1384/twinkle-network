import request from 'axios'
import { auth, handleError } from '../constants'
import { URL } from 'constants/URL'
import NOTI from '../constants/Noti'

const API_URL = `${URL}/notification`
const appVersion = '0.0.94'

export const checkVersion = () => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/version?version=${appVersion}`
    )
    dispatch({
      type: NOTI.CHECK_VERSION,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const clearNotifications = () => ({
  type: NOTI.CLEAR
})

export const fetchNotifications = () => async dispatch => {
  try {
    if (auth().headers.authorization === null) {
      const { data } = await request.get(`${API_URL}/chatSubject`)
      return dispatch({
        type: NOTI.LOAD,
        data: {
          notifications: [],
          currentChatSubject: data
        }
      })
    }
    const { data } = await request.get(API_URL, auth())
    return dispatch({
      type: NOTI.LOAD,
      data
    })
  } catch (error) {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
}

export const increaseNumNewPosts = () => ({
  type: NOTI.INCREASE_NUM_NEW_POSTS
})

export const notifyChatSubjectChange = subject => ({
  type: NOTI.CHAT_SUBJECT_CHANGE,
  subject
})

export const resetNumNewPosts = () => ({
  type: NOTI.RESET_NUM_NEW_POSTS
})
