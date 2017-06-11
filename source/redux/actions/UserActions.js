/* global localStorage */

import request from 'axios'
import {token, auth, handleError} from './constants'
import {URL} from 'constants/URL'

const API_URL = `${URL}/user`

export const checkValidUsername = username => dispatch =>
request.get(`${API_URL}/username/check?username=${username}`)
.then(
  response => {
    const {data} = response
    if (data.pageNotExists) {
      return dispatch({
        type: 'SHOW_USER_NOT_EXISTS'
      })
    }
    dispatch({
      type: 'SHOW_USER_PROFILE',
      data: data.user
    })
  }
).catch(
  error => {
    dispatch({
      type: 'SHOW_USER_NOT_EXISTS'
    })
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchUsers = () => dispatch =>
request.get(`${API_URL}/users`).then(
  response => dispatch({
    type: 'FETCH_USERS',
    data: response.data
  })
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const fetchMoreUsers = (shownUsersId) => dispatch =>
request.get(`${API_URL}/users?${shownUsersId.map(id => `shownUsers[]=${id}`).join('&')}`).then(
  response => {
    dispatch({
      type: 'FETCH_MORE_USERS',
      data: response.data
    })
    return Promise.resolve()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const initSession = data => ({
  type: 'FETCH_SESSION',
  data
})

export const initSessionAsync = (pathname) => dispatch => {
  if (token() === null) {
    return request.post(`${API_URL}/recordAnonTraffic`, {pathname})
  }
  return request.get(`${API_URL}/session?pathname=${pathname}`, auth())
  .then(
    response => dispatch(initSession({...response.data, loggedIn: true})),
  ).catch(
    () => dispatch(initSession({loggedIn: false}))
  )
}

export const login = data => ({
  type: 'SIGNIN_LOGIN',
  data
})

export const loginAsync = params => dispatch =>
request.post(`${API_URL}/login`, params)
.then(
  response => {
    localStorage.setItem('token', response.data.token)
    dispatch(login(response.data))
  }
).catch(
  error => {
    if (error.response.status === 401) {
      return Promise.reject('Incorrect username/password combination')
    }
    return Promise.reject('There was an error')
  }
)

export const logout = () => {
  localStorage.removeItem('token')
  return {
    type: 'SIGNIN_LOGOUT'
  }
}

export const signupAsync = params => dispatch =>
request.post(`${API_URL}/signup`, params)
.then(
  response => {
    if (response.data.token) localStorage.setItem('token', response.data.token)
    dispatch({
      type: 'SIGNIN_SIGNUP',
      data: response.data
    })
  }
).catch(
  error => Promise.reject(error.response.data)
)

export const uploadBio = (params, callback) => dispatch =>
request.post(`${API_URL}/bio`, params, auth())
.then(
  response => {
    dispatch({
      type: 'UPDATE_BIO',
      data: response.data
    })
    callback()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const uploadProfilePic = (image, callback) => dispatch =>
request.post(`${API_URL}/picture`, {image}, auth())
.then(
  response => {
    dispatch({
      type: 'UPDATE_PROFILE_PICTURE',
      data: response.data.imageId
    })
    callback()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const openSigninModal = () => ({
  type: 'SIGNIN_OPEN'
})

export const closeSigninModal = () => ({
  type: 'SIGNIN_CLOSE'
})

export const unmountProfile = () => ({
  type: 'UNMOUNT_PROFILE'
})
