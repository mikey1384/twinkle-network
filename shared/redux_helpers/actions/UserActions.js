import request from 'axios';
import {URL} from './URL';

const API_URL = `${URL}/user`;

const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const auth = () => ({
  headers: {
    authorization: token()
  }
})

export function initSession(data) {
  return {
    type: 'FETCH_SESSION',
    data
  }
}

export function initSessionAsync() {
  return dispatch => {
    if (token() === null) return;
    return request.get(`${API_URL}/session`, auth()).then(
      response => dispatch(initSession({...response.data, loggedIn: true}))
    ).catch(
      error => {
        console.error(error);
        dispatch(initSession({loggedIn: false}));
      }
    )
  }
}

export function login(data) {
  return {
    type: 'SIGNIN_LOGIN',
    data
  }
}

export function loginAsync(params) {
  return dispatch => {
    return request.post(`${API_URL}/login`, params).then(
      response => {
        localStorage.setItem('token', response.data.token);
        dispatch(login(response.data));
      }
    ).catch(
      error => {
        if (error.data === "Unauthorized") {
          return dispatch(login({result: "Incorrect username/password combination"}))
        }
        dispatch(login({result: error.data}))
      }
    )
  }
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: 'SIGNIN_LOGOUT'
  }
}

export function signup(data) {
  return {
    type: 'SIGNIN_SIGNUP',
    data
  }
}

export function signupAsync(params) {
  return dispatch => {
    return request.post(`${API_URL}/signup`, params).then(
      response => {
        if (response.data.token) localStorage.setItem('token', response.data.token);
        dispatch(signup(response.data))
      }
    )
  }
}

export function openSigninModal() {
  return {
    type: 'SIGNIN_OPEN'
  }
}

export function closeSigninModal() {
  return {
    type: 'SIGNIN_CLOSE'
  }
}

export function hideErrorAlert() {
  return {
    type: 'SIGNIN_HIDEALERT'
  }
}
