import request from 'axios';
import {auth, handleError} from './constants';
import {URL} from 'constants/URL';

const API_URL = `${URL}/notifications`;

export const fetchNotifications = data => ({
  type: 'FETCH_NOTIFICATIONS'
})

export const fetchNotificationsAsync = () => dispatch => {
  if (auth() === null) return;
  request.get(API_URL, auth()).then(
    response => {
      dispatch(actions.fetchNotifications(response.data))
    }
  ).catch(
    error => {
      console.error(error)
      handleError(error, dispatch)
    }
  )
}
