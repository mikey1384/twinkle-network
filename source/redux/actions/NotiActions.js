import request from 'axios';
import {auth, handleError} from './constants';
import {URL} from 'constants/URL';

const API_URL = `${URL}/notification`;

export const fetchNotifications = data => ({
  type: 'FETCH_NOTIFICATIONS'
})

export const fetchNotificationsAsync = () => dispatch => {
  if (auth() === null) return;
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
