import request from 'axios'
import {URL} from 'constants/URL'
import {auth} from 'redux/actions/constants'
const API_URL = `${URL}/user`

export function recordUserAction({action, ...rest}) {
  request.post(`${API_URL}/${action}`, rest, auth())
}
