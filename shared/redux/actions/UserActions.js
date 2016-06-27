import request from 'axios';
import {URL} from 'constants/URL';

const API_URL = `${URL}/user`;

const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const auth = () => ({
  headers: {
    authorization: token()
  }
})

export const initSession = data => ({
  type: 'FETCH_SESSION',
  data
})

export const initSessionAsync = () => dispatch => {
  if (token() === null) return;
  return request.get(`${API_URL}/session`, auth())
  .then(
    response => dispatch(initSession({...response.data, loggedIn: true})),
  ).catch(
    error => dispatch(initSession({loggedIn: false}))
  )
}

export const login = data => ({
  type: 'SIGNIN_LOGIN',
  data
})

export const loginAsync = params => dispatch => request.post(`${API_URL}/login`, params)
.then(
  response => {
    localStorage.setItem('token', response.data.token);
    dispatch(login(response.data));
  }
).catch(
  error => {
    if (error.status === 401) {
      return dispatch(login({result: "Incorrect username/password combination"}))
    }
    dispatch(login({result: error.data}))
  }
)

export const logout = () => {
  localStorage.removeItem('token');
  return {
    type: 'SIGNIN_LOGOUT'
  }
}

export const signup = data => ({
  type: 'SIGNIN_SIGNUP',
  data
})

export const signupAsync = params => dispatch => request.post(`${API_URL}/signup`, params)
.then(
  response => {
    if (response.data.token) localStorage.setItem('token', response.data.token);
    dispatch(signup(response.data))
  }
)

export const openSigninModal = () => ({
  type: 'SIGNIN_OPEN'
})

export const closeSigninModal = () => ({
  type: 'SIGNIN_CLOSE'
})

export const hideErrorAlert = () => ({
  type: 'SIGNIN_HIDEALERT'
})
