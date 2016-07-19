import request from 'axios';
import {URL} from 'constants/URL';
import {logout, openSigninModal} from '../UserActions';
import {API_URL, token, auth, handleError} from './constants';
import * as actions from './actions';


export const checkChatExistsThenOpenNewChatOrEnterExistingChat = (user, partner, callback) => dispatch => {
  const {checkChatExists} = actions;
  dispatch(checkChatExists(user, partner, {then: followUp}));
  function followUp(data) {
    if (data.channelExists) {
      dispatch(actions.enterChannelAsync(data.channelId))
    }
    else {
      dispatch(actions.openBidirectionalChat(user, partner))
    }
    if (callback) callback()
  }
}

export const clearSearchResults = () => ({
  type: 'CLEAR_RESULTS_FOR_CHANNEL'
})

export const createBidirectionalChannelAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/channel/bidirectional`, params, auth())
.then(
  response => {
    if (response.data.alreadyExists) {
      dispatch(actions.ifBidrectionalChannelExists(response.data.alreadyExists.message));
      return callback(response.data);
    }
    dispatch(actions.createBidirectionalChannel(response.data));
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
    dispatch(actions.createNewChannel(response.data))
    callback(response.data)
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const enterChannel = (channelId, callback) => actions.enterChannelAsync(channelId, callback)

export const enterEmptyBidirectionalChat = () => ({
  type: 'ENTER_EMPTY_BIDIRECTIONAL_CHAT'
})

export const getNumberOfUnreadMessagesAsync = () => dispatch => {
  if (auth() === null) return;
  request.get(`${API_URL}/numUnreads`, auth()).then(
    response => {
      dispatch(actions.getNumberOfUnreadMessages(response.data.numUnreads))
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

export const loadMoreMessagesAsync = (userId, messageId, roomId) => dispatch =>
request.get(`${API_URL}/more?userId=${userId}&messageId=${messageId}&roomId=${roomId}`, auth())
.then(
  response => dispatch(actions.loadMoreMessages(response.data))
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const initChatAsync = callback => dispatch =>
request.get(API_URL, auth())
.then(
  response => {
    dispatch(actions.initChat(response.data));
    callback(dispatch);
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const inviteUsersToChannelAsync = (params, callback) => dispatch =>
request.post(`${API_URL}/invite`, params, auth())
.then(
  response => {
    const {message} = response.data;
    let data = {
      ...params,
      message
    }
    dispatch(actions.inviteUsersToChannel(data));
    callback(message);
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const leaveChannelAsync = channelId => dispatch =>
request.delete(`${API_URL}/channel?channelId=${channelId}`, auth())
.then(
  response => {
    dispatch(actions.leaveChannel(channelId))
    dispatch(enterChannelAsync(2))
  }
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const openDirectMessageAsync = (user, partner) => dispatch => {
  let cb = dispatch => dispatch(checkChatExistsThenOpenNewChatOrEnterExistingChat(user, partner))
  dispatch(actions.fetchChannelsAsync(cb))
}

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

export const resetChat = () => ({
  type: 'RESET_CHAT'
})

export const searchUserToInviteAsync = text => dispatch =>
request.get(`${API_URL}/search?text=${text}`)
.then(
  response => dispatch(actions.searchUserToInvite(response.data))
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const submitMessageAsync = (params, callback) => dispatch => {
  let message = {
    ...params,
    timeposted: Math.floor(Date.now()/1000)
  }
  dispatch(actions.submitMessage(message))
  request.post(API_URL, {params}, auth())
  .then(
    response => {
      const {channels} = response.data;
      dispatch(actions.updateChannelList({channels}))
      callback(message);
    }
  ).catch(
    error => {
      console.error(error)
      handleError(error, dispatch)
    }
  )
}

export const toggleChat = () => ({
  type: 'TOGGLE_CHAT'
})

export const turnChatOff = () => ({
  type: 'TURN_CHAT_OFF'
})
