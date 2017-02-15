import request from 'axios'
import {handleError} from './constants'
import {URL} from 'constants/URL'
const API_URL = `${URL}/url`

export const fetchLinks = () => dispatch =>
request.get(API_URL).then(
  response => {
    dispatch({
      type: 'FETCH_LINKS',
      links: response.data
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchMoreLinks = linkId => dispatch =>
request.get(`${API_URL}?linkId=${linkId}`).then(
  response => {
    dispatch({
      type: 'FETCH_MORE_LINKS',
      links: response.data
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)
