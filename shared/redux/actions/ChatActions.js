import request from 'axios';
import {URL} from 'constants/URL';
import {logout, openSigninModal} from './UserActions';

const API_URL = `${URL}/chat`;
const token = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const auth = () => ({
  headers: {
    authorization: token()
  }
})

export const initChat = (data) => ({
  type: 'INIT_CHAT',
  data
})

export const initChatAsync = callback => dispatch =>
request.get(API_URL, auth())
.then(
  response => {
    dispatch(initChat(response.data));
    callback();
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const loadMoreMessages = (data) => ({
  type: 'LOAD_MORE_MSG',
  data
})

export const loadMoreMessagesAsync = (userId, messageId, roomId) => dispatch =>
request.get(`${API_URL}/more?userId=${userId}&messageId=${messageId}&roomId=${roomId}`, auth())
.then(
  response => dispatch(loadMoreMessages(response.data))
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const receiveMessage = (data) => ({
  type: 'RECEIVE_MSG',
  data
})

export const updateChannelList = (data) => ({
  type: 'UPDATE_CHANNEL_LIST',
  data
})

export const searchUserToInvite = data => ({
  type: 'SEARCH_USERS_FOR_CHANNEL',
  data
})

export const searchUserToInviteAsync = text => dispatch =>
request.get(`${API_URL}/search?text=${text}`)
.then(
  response => dispatch(searchUserToInvite(response.data))
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const clearSearchResults = () => ({
  type: 'CLEAR_RESULTS_FOR_CHANNEL'
})

export const submitMessageAsync = (params, callback) => dispatch =>
request.post(API_URL, {params}, auth())
.then(
  response => {
    const {messageId, timeposted, channels} = response.data;
    dispatch(updateChannelList({channels}))
    callback(messageId, timeposted);
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const enterChannel = (data) => ({
  type: 'ENTER_CHANNEL',
  data
})

export const enterChannelAsync = channelId => dispatch =>
request.get(`${API_URL}/channel?channelId=${channelId}`, auth())
.then(
  response => dispatch(enterChannel(response.data))
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const enterEmptyBidirectionalChat = () => ({
  type: 'ENTER_EMPTY_BIDIRECTIONAL_CHAT'
})

export const openBidirectionalChat = (userId, username) => ({
  type: 'OPEN_BIDIRECTIONAL_CHAT',
  userId,
  username
})

export const checkChannelExistsAsync = (userId, username, callback) => dispatch =>
request.get(`${API_URL}/channel/check?partnerId=${userId}`, auth())
.then(
  response => {
    callback()
    if (response.data.channelExists) {
      dispatch(enterChannelAsync(response.data.channelId))
    } else {
      dispatch(openBidirectionalChat(userId, username))
    }
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const receiveFirstBidirectionalMsg = data => ({
  type: 'RECEIVE_FIRST_BIDIRECTIONAL_MSG',
  data
})

export const createBidirectionalChannel = data => ({
  type: 'CREATE_BIDIRECTIONAL_CHANNEL',
  data
})

export const createBidirectionalChannelAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/channel/bidirectional`, params, auth())
.then(
  response => {
    dispatch(createBidirectionalChannel(response.data));
    callback(response.data);
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const createNewChannelAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/channel`, {params}, auth())
.then(
  response => {
    callback()
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const resetChat = () => ({
  type: 'RESET_CHAT'
})

function handleError(error, dispatch) {
  if (error.status === 401) {
    dispatch(logout());
    dispatch(openSigninModal());
  }
}
