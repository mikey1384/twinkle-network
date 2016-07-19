import request from 'axios';
import {API_URL, token, auth, handleError} from './constants';


export const checkChatExists = (user, partner, {then}) => dispatch =>
request.get(`${API_URL}/channel/check?partnerId=${partner.userId}`, auth())
.then(
  response => then(response.data)
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const createBidirectionalChannel = data => ({
  type: 'CREATE_BIDIRECTIONAL_CHANNEL',
  data
})

export const createNewChannel = data => ({
  type: 'CREATE_NEW_CHANNEL',
  data
})

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

export const fetchChannelsAsync = callback => dispatch => {
  request.get(`${API_URL}/channels`, auth())
  .then(
    response => {
      dispatch(updateChannelList(response.data))
      callback(dispatch)
    }
  ).catch(
    error => {
      console.error(error)
      handleError(error, dispatch)
    }
  )
}

export const getNumberOfUnreadMessages = numUnreads => ({
  type: 'GET_NUM_UNREAD_MSGS',
  numUnreads
})

export const ifBidrectionalChannelExists = data => ({
  type: 'IF_BIDIRECTIONAL_CHANNEL_EXISTS',
  data
})

export const initChat = (data) => ({
  type: 'INIT_CHAT',
  data
})

export const inviteUsersToChannel = data => ({
  type: 'INVITE_USERS_TO_CHANNEL',
  data
})

export const leaveChannel = channelId => ({
  type: 'LEAVE_CHANNEL',
  channelId
})

export const loadMoreMessages = (data) => ({
  type: 'LOAD_MORE_MSG',
  data
})

export const openBidirectionalChat = (user, partner) => ({
  type: 'OPEN_BIDIRECTIONAL_CHAT',
  user,
  partner
})

export const searchUserToInvite = data => ({
  type: 'SEARCH_USERS_FOR_CHANNEL',
  data
})

export const submitMessage = message => ({
  type: 'SUBMIT_MESSAGE',
  message
})

export const updateChannelList = (data) => ({
  type: 'UPDATE_CHANNEL_LIST',
  data
})
