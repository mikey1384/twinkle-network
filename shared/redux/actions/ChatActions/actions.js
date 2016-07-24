import request from 'axios';
import {auth, handleError} from '../constants';
import {URL} from 'constants/URL';

const API_URL = `${URL}/chat`;

export const applyChangedChannelTitle = data => ({
  type: 'APPLY_CHANGED_CHANNEL_TITLE',
  data
})

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

export const createNewChannel = data => ({
  type: 'CREATE_NEW_CHANNEL',
  data
})

export const createNewChat = data => ({
  type: 'CREATE_NEW_CHAT',
  data
})

export const enterChannel = data => ({
  type: 'ENTER_CHANNEL',
  data
})

export const fetchChannelWithId = (channelId, {then}) => dispatch =>
request.get(`${API_URL}/channel?channelId=${channelId}`, auth())
.then(
  response => then(response.data)
).catch(
  error => {
    console.error(error)
    handleError(error, dispatch)
  }
)

export const fetchChannelsAsync = ({then}) => dispatch => {
  request.get(`${API_URL}/channels`, auth())
  .then(
    response => then(response.data)
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

export const hideChat = channelId => ({
  type: 'HIDE_CHAT',
  channelId
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

export const openNewChatTab = (user, partner) => ({
  type: 'OPEN_NEW_CHAT_TAB',
  user,
  partner
})

export const receiveExistingChatData = data => ({
  type: 'RECEIVE_EXISTING_CHAT_DATA',
  data
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
