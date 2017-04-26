import request from 'axios'
import {auth, handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/notification`
const appVersion = 0.01

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

export const fetchNotifications = data => ({
  type: 'FETCH_NOTIFICATIONS'
})

export const fetchNotificationsAsync = () => dispatch => {
  if (auth() === null) return
  request.get(API_URL, auth()).then(
    response => {
      dispatch(fetchNotifications(response.data))
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}
