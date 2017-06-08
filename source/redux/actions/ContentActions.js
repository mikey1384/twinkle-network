import request from 'axios'
import {handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/content`

export const clearSearchResults = () => ({
  type: 'CLEAR_CONTENT_SEARCH_RESULTS'
})

export const searchContent = text => dispatch =>
request.get(`${API_URL}/search?query=${text}`)
.then(
  response => dispatch({
    type: 'SEARCH_CONTENT',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)
