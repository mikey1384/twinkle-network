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

export const toggleChat = () => ({
  type: 'TOGGLE_CHAT'
})

export const turnChatOff = () => ({
  type: 'TURN_CHAT_OFF'
})

export const turnChatOn = () => ({
  type: 'TURN_CHAT_ON'
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
    callback(dispatch);
  }
)

export const getNumberOfUnreadMessages = numUnreads => ({
  type: 'GET_NUM_UNREAD_MSGS',
  numUnreads
})

export const getNumberOfUnreadMessagesAsync = () => dispatch => {
  if (auth() === null) return;
  request.get(`${API_URL}/numUnreads`, auth()).then(
    response => {
      dispatch(getNumberOfUnreadMessages(response.data.numUnreads))
    }
  ).catch(
    error => {
      console.error(error)
      handleError(error, dispatch)
    }
  )
}

export const increaseNumberOfUnreadMessages = () => ({
  type: 'INCREASE_NUM_UNREAD_MSGS'
})

export const openDirectMessage = (user, partner) => dispatch => {
  let cb = dispatch => {
    dispatch(checkChannelExistsAsync(user, partner, () => dispatch(turnChatOn())))
  }
  dispatch(initChatAsync(cb))
}

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

export const inviteUsersToChannel = data => ({
  type: 'INVITE_USERS_TO_CHANNEL',
  data
})

export const inviteUsersToChannelAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/invite`, params, auth())
.then(
  response => {
    const {message} = response.data;
    let data = {
      ...params,
      message
    }
    dispatch(inviteUsersToChannel(data));
    callback(message);
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const submitMessage = message => ({
  type: 'SUBMIT_MESSAGE',
  message
})

export const submitMessageAsync = (params, callback) => dispatch => {
  let message = {
    ...params,
    timeposted: Math.floor(Date.now()/1000)
  }
  dispatch(submitMessage(message))
  request.post(API_URL, {params}, auth())
  .then(
    response => {
      const {channels} = response.data;
      dispatch(updateChannelList({channels}))
      callback(message);
    }
  ).catch(
    error => {
      console.error(error)
      handleError(error, dispatch)
    }
  )
}

export const enterChannel = (data, currentChannelOnline) => ({
  type: 'ENTER_CHANNEL',
  data
})

export const enterChannelAsync = (channelId, callback) => dispatch =>
request.get(`${API_URL}/channel?channelId=${channelId}`, auth())
.then(
  response => {
    dispatch(enterChannel(response.data));
    if (callback) callback();
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const enterEmptyBidirectionalChat = () => ({
  type: 'ENTER_EMPTY_BIDIRECTIONAL_CHAT'
})

export const openBidirectionalChat = (user, partner) => ({
  type: 'OPEN_BIDIRECTIONAL_CHAT',
  user,
  partner
})

export const checkChannelExistsAsync = (user, partner, callback) => dispatch =>
request.get(`${API_URL}/channel/check?partnerId=${partner.userId}`, auth())
.then(
  response => {
    if (callback) callback();
    if (response.data.channelExists) {
      dispatch(enterChannelAsync(response.data.channelId))
    } else {
      dispatch(openBidirectionalChat(user, partner))
    }
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const receiveMessage = data => {
  const {channelId, timeposted} = data;
  request.post(`${API_URL}/lastRead`, {channelId, timeposted} , auth())
  return {
    type: 'RECEIVE_MSG',
    data
  }
}

export const receiveMessageOnDifferentChannel = data => ({
  type: 'RECEIVE_MSG_ON_DIFFERENT_CHANNEL',
  data
})

export const receiveFirstMsg = data => ({
  type: 'RECEIVE_FIRST_MSG',
  data
})

export const ifBidrectionalChannelExists = data => ({
  type: 'IF_BIDIRECTIONAL_CHANNEL_EXISTS',
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
    if (response.data.alreadyExists) {
      dispatch(ifBidrectionalChannelExists(response.data.alreadyExists.message));
      return callback(response.data);
    }
    dispatch(createBidirectionalChannel(response.data));
    callback(response.data);
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const createNewChannel = data => ({
  type: 'CREATE_NEW_CHANNEL',
  data
})

export const createNewChannelAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/channel`, {params}, auth())
.then(
  response => {
    dispatch(createNewChannel(response.data))
    callback(response.data)
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const leaveChannel = channelId => ({
  type: 'LEAVE_CHANNEL',
  channelId
})

export const leaveChannelAsync = channelId => dispatch =>
request.delete(`${API_URL}/channel?channelId=${channelId}`, auth())
.then(
  response => {
    dispatch(leaveChannel(channelId))
    dispatch(enterChannelAsync(2))
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
