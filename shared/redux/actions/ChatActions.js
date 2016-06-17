import request from 'axios';
import { URL } from 'constants/URL';
import { logout, openSigninModal } from './UserActions';

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
  error => handleError(error, dispatch)
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
  error => handleError(error, dispatch)
)

export const receiveMessage = (data) => ({
  type: 'RECEIVE_MSG',
  data
})

export const updateChannelList = (data) => ({
  type: 'UPDATE_CHANNEL_LIST',
  data
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
  error => handleError(error, dispatch)
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
  error => handleError(error, dispatch)
)

export const searchUserToInvite = data => ({
  type: 'SEARCH_USERS_FOR_CHANNEL',
  data
})

export const searchUserToInviteAsync = text => dispatch =>
request.get(`${API_URL}/search?text=${text}`)
.then(
  response => dispatch(searchUserToInvite(response.data))
).catch(
  error => handleError(error, dispatch)
)

export const clearSearchResults = () => ({
  type: 'CLEAR_RESULTS_FOR_CHANNEL'
})

function handleError(error, dispatch) {
  if (error.data === 'Unauthorized') {
    dispatch(logout());
    dispatch(openSigninModal());
  } else {
    console.error(error);
  }
}
