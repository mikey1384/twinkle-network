import request from 'axios';
import {URL} from './URL';

const API_URL = `${URL}/api/user`;

export function initSession() {
  return {
    type: 'FETCH_SESSION',
    promise: request.post(`${API_URL}/session`, {session: SESSION})
  }
}

export function checkSession() {
  return {
    type: 'FETCH_SESSION',
    promise: request.get(`${API_URL}/session`)
  }
}

export function login(params) {
  return {
    type: 'SIGNIN_LOGIN',
    promise: request.post(`${API_URL}/login`, params)
  }
}

export function logout() {
  return {
    type: 'SIGNIN_LOGOUT',
    promise: request.get(`${API_URL}/logout`)
  }
}

export function signup(params) {
  return {
    type: 'SIGNIN_SIGNUP',
    promise: request.post(`${API_URL}/signup`, params)
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
