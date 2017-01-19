import request from 'axios';
import {auth, handleError} from '../constants';
import * as actions from './actions';
import {GENERAL_CHAT_ID} from 'constants/database';
import {URL} from 'constants/URL';

const API_URL = `${URL}/chat`;


export const enterChannelWithId = (channelId, showOnTop) => dispatch => {
  const {fetchChannelWithId, enterChannel} = actions;
  dispatch(fetchChannelWithId(channelId, {then: followUp}));

  function followUp(data) {
    dispatch(enterChannel(data, showOnTop))
  }
}

export const checkChatExistsThenOpenNewChatTabOrEnterExistingChat = (user, partner, callback) => dispatch => {
  const {checkChatExists, openNewChatTab} = actions;
  dispatch(checkChatExists(user, partner, {then: followUp}));
  function followUp(data) {
    if (data.channelExists) {
      dispatch(enterChannelWithId(data.channelId))
    }
    else {
      dispatch(openNewChatTab(user, partner))
    }
    if (callback) callback()
  }
}

export const clearChatSearchResults = () => ({
  type: 'CLEAR_CHAT_SEARCH_RESULTS'
})

export const clearUserSearchResults = () => ({
  type: 'CLEAR_USER_SEARCH_RESULTS'
})

export const checkChatExistsThenCreateNewChatOrReceiveExistingChatData = (params, callback) => dispatch =>
request.post(`${API_URL}/channel/twoPeople`, {...params, timeStamp: Math.floor(Date.now()/1000)}, auth())
.then(
  response => {
    if (!!response.data.alreadyExists) {
      dispatch(actions.receiveExistingChatData(response.data.alreadyExists.message));
      return callback(response.data);
    }
    dispatch(actions.createNewChat(response.data));
    callback(response.data);
  }
).catch(
  error => {
    console.error(error.response || error)
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
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const editChannelTitle = (params, callback) => dispatch =>
request.post(`${API_URL}/title`, params, auth())
.then(
  response => {
    dispatch(actions.applyChangedChannelTitle(params));
    if (callback) callback();
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const enterEmptyChat = () => ({
  type: 'ENTER_EMPTY_CHAT'
})

export const getNumberOfUnreadMessagesAsync = () => dispatch => {
  if (auth() === null) return;
  request.get(`${API_URL}/numUnreads`, auth()).then(
    response => {
      dispatch(actions.getNumberOfUnreadMessages(response.data.numUnreads))
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const hideChatAsync = channelId => dispatch =>
request.post(`${API_URL}/hideChat`, {channelId}, auth())
.then(
  response => {
    dispatch(actions.hideChat(channelId))
    dispatch(enterChannelWithId(GENERAL_CHAT_ID))
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const increaseNumberOfUnreadMessages = () => ({
  type: 'INCREASE_NUM_UNREAD_MSGS'
})

export const initChatAsync = callback => dispatch =>
request.get(API_URL, auth())
.then(
  response => {
    dispatch(actions.initChat(response.data));
    callback(dispatch);
  }
).catch(
  error => {
    console.error(error.response || error)
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
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const loadMoreMessagesAsync = (userId, messageId, channelId, callback) => dispatch =>
request.get(`${API_URL}/more?userId=${userId}&messageId=${messageId}&channelId=${channelId}`, auth())
.then(
  response => {
    dispatch(actions.loadMoreMessages(response.data))
    callback()
  }
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const leaveChannelAsync = channelId => dispatch => {
  const timeStamp = Math.floor(Date.now()/1000);
  request.delete(`${API_URL}/channel?channelId=${channelId}&timeStamp=${timeStamp}`, auth())
  .then(
    response => {
      dispatch(actions.leaveChannel(channelId))
      dispatch(enterChannelWithId(GENERAL_CHAT_ID))
    }
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
}

export const notifyThatMemberLeftChannel = data => ({
  type: 'NOTIFY_MEMBER_LEFT',
  data
})

export const openDirectMessage = (user, partner) => dispatch => {
  dispatch(actions.fetchChannelsAsync({then: followUp}))
  function followUp(data) {
    dispatch(actions.updateChannelList(data))
    dispatch(checkChatExistsThenOpenNewChatTabOrEnterExistingChat(user, partner))
  }
}

export const receiveMessage = data => dispatch => {
  const {channelId, timeStamp} = data;
  request.post(`${API_URL}/lastRead`, {channelId, timeStamp}, auth()).then(
    response => dispatch({
      type: 'RECEIVE_MSG',
      data
    })
  ).catch(
    error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    }
  )
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

export const searchChatAsync = text => dispatch =>
request.get(`${API_URL}/search/chat?text=${text}`, auth())
.then(
  response => dispatch(actions.searchChat(response.data))
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const searchUserToInviteAsync = text => dispatch =>
request.get(`${API_URL}/search/users?text=${text}`)
.then(
  response => dispatch(actions.searchUserToInvite(response.data))
).catch(
  error => {
    console.error(error.response || error)
    handleError(error, dispatch)
  }
)

export const submitMessageAsync = (params, callback) => dispatch => {
  let message = {
    ...params,
    timeStamp: Math.floor(Date.now()/1000)
  }
  dispatch(actions.submitMessage(message))
  request.post(API_URL, {message}, auth())
  .then(
    response => {
      const {channels} = response.data;
      dispatch(actions.updateChannelList({channels}))
      callback(params);
    }
  ).catch(
    error => {
      console.error(error.response || error)
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
