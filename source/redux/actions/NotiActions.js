import request from 'axios'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/notification`
const appVersion = 0.041

export const checkVersion = () => dispatch =>
  request.get(`${API_URL}/version?version=${appVersion}`).then(
    response => dispatch({
      type: 'CHECK_VERSION',
      data: response.data
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )

export const clearNotifications = () => ({
  type: 'CLEAR_NOTIFICATIONS'
})

export const fetchNotifications = () => dispatch => {
  if (auth().headers.authorization === null) {
    return request.get(`${API_URL}/chatSubject`).then(
      response => dispatch({
        type: 'FETCH_NOTIFICATIONS',
        data: {
          notifications: [],
          currentChatSubject: response.data
        }
      })
    )
  }
  return request.get(API_URL, auth()).then(
    response => dispatch({
      type: 'FETCH_NOTIFICATIONS',
      data: response.data
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const notifyChatSubjectChange = subject => ({
  type: 'NOTIFY_CHAT_SUBJECT_CHANGE',
  subject
})
