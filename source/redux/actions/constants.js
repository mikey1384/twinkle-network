/* global localStorage */
import {logout, openSigninModal} from './UserActions'

export const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
export const auth = () => ({
  headers: {
    authorization: token()
  }
})
export function handleError(error, dispatch) {
  if (error.response && error.response.status === 401) {
    dispatch(logout())
    dispatch(openSigninModal())
  }
}
