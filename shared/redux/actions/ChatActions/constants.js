import {URL} from 'constants/URL';
import {logout, openSigninModal} from '../UserActions';

export const API_URL = `${URL}/chat`;
export const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
export const auth = () => ({
  headers: {
    authorization: token()
  }
})
export function handleError(error, dispatch) {
  if (error.response.status === 401) {
    dispatch(logout());
    dispatch(openSigninModal());
  }
}
