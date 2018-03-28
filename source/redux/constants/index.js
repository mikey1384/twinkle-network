/* global localStorage */
import { logout, openSigninModal } from '../actions/UserActions'

export const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null

export const auth = () => ({
  headers: {
    authorization: token()
  }
})

export function handleError(error, dispatch) {
  if (error.response) {
    const { status } = error.response
    if (status === 401) {
      dispatch(logout())
      dispatch(openSigninModal())
    }
    if (status === 301) {
      window.location.reload()
    }
  }
}

export { default as Chat } from './Chat'
