import {URL} from 'constants/URL';

export const API_URL = `${URL}/chat`;
export const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
export const auth = () => ({
  headers: {
    authorization: token()
  }
})
