import request from 'axios'
import { URL } from 'constants/URL'
import { auth } from './requestHelpers'
const API_URL = `${URL}/user`

export function recordUserAction({ action, ...rest }) {
  return request.post(`${API_URL}/action/${action}`, rest, auth())
}
