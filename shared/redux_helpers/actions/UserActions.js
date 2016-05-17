import request from 'axios';
import {URL} from './URL';

const API_URL = `${URL}/api/user`;

export function initSession(data) {
  return {
    type: 'FETCH_SESSION',
    data
  }
}

export function initSessionAsync() {
  return dispatch => {
    return request.post(`${API_URL}/session`, {session: SESSION}).then(
      response => dispatch(initSession(response.data))
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
      response => dispatch(login(response.data))
    )
  }
}

export function logout() {
  return {
    type: 'SIGNIN_LOGOUT'
  }
}

export function logoutAsync() {
  return dispatch => {
    return request.get(`${API_URL}/logout`).then(
      response => dispatch(logout())
    )
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
      response => dispatch(signup(response.data))
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
