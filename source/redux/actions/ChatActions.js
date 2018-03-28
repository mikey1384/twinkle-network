import request from 'axios'
import { GENERAL_CHAT_ID } from 'constants/database'
import { auth, handleError } from '../constants'
import { URL } from 'constants/URL'
import CHAT from '../constants/Chat'

const API_URL = `${URL}/chat`

export const openNewChatTab = (user, partner) => ({
  type: CHAT.OPEN_NEW_TAB,
  user,
  partner
})

export const changeChatSubject = subject => ({
  type: CHAT.CHANGE_SUBJECT,
  subject
})

export const selectChannel = channelId => dispatch => {
  dispatch({
    type: CHAT.SELECT_CHANNEL,
    channelId
  })
  return Promise.resolve()
}

export const enterChannelWithId = (channelId, showOnTop) => dispatch => {
  dispatch(selectChannel(channelId))
    .then(() =>
      request.get(`${API_URL}/channel?channelId=${channelId}`, auth())
    )
    .then(response =>
      dispatch({
        type: CHAT.ENTER_CHANNEL,
        data: response.data,
        showOnTop
      })
    )
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const resetMsgUnreadsOnTabSwitch = () => ({
  type: CHAT.RESET_MSG_UNREADS_ON_TAB_SWITCH
})

export const clearChatSearchResults = () => ({
  type: CHAT.CLEAR_CHAT_SEARCH_RESULTS
})

export const clearSubjectSearchResults = () => ({
  type: CHAT.CLEAR_SUBJECT_SEARCH_RESULTS
})

export const clearUserSearchResults = () => ({
  type: CHAT.CLEAR_USER_SEARCH_RESULTS
})

export const createNewChannelAsync = (params, callback) => dispatch =>
  request
    .post(`${API_URL}/channel`, { params }, auth())
    .then(({ data }) => {
      dispatch({
        type: CHAT.CREATE_NEW_CHANNEL,
        data
      })
      callback(data)
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const deleteMessage = messageId => dispatch =>
  request
    .delete(`${API_URL}/message?messageId=${messageId}`, auth())
    .then(response => {
      dispatch({
        type: CHAT.DELETE_MESSAGE,
        messageId
      })
      return Promise.resolve()
    })

export const editChannelTitle = (params, callback) => dispatch =>
  request
    .post(`${API_URL}/title`, params, auth())
    .then(response => {
      dispatch({
        type: CHAT.APPLY_CHANGED_CHANNEL_TITLE,
        data: params
      })
      if (callback) callback()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const editMessage = ({ editedMessage, messageId }) => dispatch =>
  request
    .put(`${API_URL}/message`, { editedMessage, messageId }, auth())
    .then(response => {
      dispatch({
        type: CHAT.EDIT_MESSAGE,
        data: { editedMessage, messageId }
      })
      return Promise.resolve()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const enterEmptyChat = () => ({
  type: CHAT.ENTER_EMPTY_CHAT
})

export const getNumberOfUnreadMessagesAsync = () => dispatch => {
  if (auth() === null) return
  request
    .get(`${API_URL}/numUnreads`, auth())
    .then(response => {
      dispatch({
        type: CHAT.GET_NUM_UNREAD_MSGS,
        numUnreads: response.data.numUnreads
      })
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const hideChatAsync = channelId => dispatch =>
  request
    .post(`${API_URL}/hideChat`, { channelId }, auth())
    .then(response => {
      dispatch({
        type: CHAT.HIDE_CHAT,
        channelId
      })
      dispatch(enterChannelWithId(GENERAL_CHAT_ID, true))
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const increaseNumberOfUnreadMessages = () => ({
  type: CHAT.INCREASE_NUM_UNREAD_MSGS
})

export const initChatAsync = channelId => dispatch =>
  request
    .get(`${API_URL}?channelId=${channelId}`, auth())
    .then(response => {
      dispatch({
        type: CHAT.INIT,
        data: response.data
      })
      return Promise.resolve()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const inviteUsersToChannelAsync = (params, callback) => dispatch =>
  request
    .post(`${API_URL}/invite`, params, auth())
    .then(response => {
      const { message } = response.data
      let data = {
        ...params,
        message
      }
      dispatch({
        type: CHAT.INVITE_USERS_TO_CHANNEL,
        data
      })
      callback(message)
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const loadChatSubject = () => dispatch =>
  request
    .get(`${API_URL}/chatSubject`)
    .then(response => {
      dispatch({
        type: CHAT.LOAD_SUBJECT,
        subject: response.data
      })
      return Promise.resolve()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const loadMoreChannels = (currentChannelId, channelIds) => dispatch =>
  request
    .get(
      `${API_URL}/more/channels?currentChannelId=${currentChannelId}&${channelIds}`,
      auth()
    )
    .then(response => {
      dispatch({
        type: CHAT.LOAD_MORE_CHANNELS,
        data: response.data
      })
      Promise.resolve()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const loadMoreMessagesAsync = (
  userId,
  messageId,
  channelId,
  callback
) => dispatch =>
  request
    .get(
      `${API_URL}/more/messages?userId=${userId}&messageId=${messageId}&channelId=${channelId}`,
      auth()
    )
    .then(({ data }) => {
      dispatch({
        type: CHAT.LOAD_MORE_MESSAGES,
        data
      })
      callback()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const leaveChannelAsync = channelId => dispatch => {
  const timeStamp = Math.floor(Date.now() / 1000)
  request
    .delete(
      `${API_URL}/channel?channelId=${channelId}&timeStamp=${timeStamp}`,
      auth()
    )
    .then(response => {
      dispatch({
        type: CHAT.LEAVE_CHANNEL,
        channelId
      })
      dispatch(enterChannelWithId(GENERAL_CHAT_ID, true))
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const notifyThatMemberLeftChannel = data => ({
  type: CHAT.NOTIFY_MEMBER_LEFT,
  data
})

export const openDirectMessageChannel = (
  user,
  partner,
  chatCurrentlyOn
) => dispatch => {
  function fetchChannels(currentChannel) {
    if (!chatCurrentlyOn) {
      return request
        .get(
          `${API_URL}/channels?currentChannelId=${currentChannel.channelId}`,
          auth()
        )
        .then(response =>
          Promise.resolve({ currentChannel, channels: response.data })
        )
    }
    return Promise.resolve({ currentChannel, channels: [] })
  }
  return request
    .get(`${API_URL}/channel/check?partnerId=${partner.userId}`, auth())
    .then(response => fetchChannels(response.data))
    .then(({ currentChannel, channels }) => {
      dispatch({
        type: CHAT.OPEN_DM,
        user,
        partner,
        channels,
        ...currentChannel
      })
      return Promise.resolve()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const receiveMessage = ({ message, pageVisible }) => dispatch => {
  const { channelId } = message
  request
    .post(`${API_URL}/lastRead`, { channelId }, auth())
    .then(response =>
      dispatch({
        type: CHAT.RECEIVE_MESSAGE,
        pageVisible,
        data: {
          ...message,
          timeStamp: Math.floor(Date.now() / 1000)
        }
      })
    )
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const receiveMessageOnDifferentChannel = ({
  message,
  channel,
  senderIsNotTheUser
}) => ({
  type: CHAT.RECEIVE_MSG_ON_DIFF_CHANNEL,
  data: message,
  channel,
  senderIsNotTheUser
})

export const receiveFirstMsg = ({ data, duplicate, pageVisible }) => ({
  type: CHAT.RECEIVE_FIRST_MSG,
  data,
  duplicate,
  pageVisible
})

export const reloadChatSubject = subjectId => dispatch =>
  request
    .put(`${API_URL}/chatSubject/reload`, { subjectId }, auth())
    .then(({ data: { subject, message } }) => {
      dispatch({
        type: CHAT.RELOAD_SUBJECT,
        subject,
        message
      })
      return Promise.resolve({ subject, message })
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const resetChat = () => dispatch => {
  dispatch({
    type: CHAT.RESET
  })
  return Promise.resolve()
}

export const searchChatAsync = text => dispatch =>
  request
    .get(`${API_URL}/search/chat?text=${text}`, auth())
    .then(({ data }) =>
      dispatch({
        type: CHAT.SEARCH,
        data
      })
    )
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const searchChatSubject = text => dispatch =>
  request
    .get(`${API_URL}/search/subject?text=${text}`)
    .then(({ data }) => {
      dispatch({
        type: CHAT.SEARCH_SUBJECT,
        data
      })
      return Promise.resolve()
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const searchUserToInviteAsync = text => dispatch =>
  request
    .get(`${API_URL}/search/users?text=${text}`)
    .then(({ data }) =>
      dispatch({
        type: CHAT.SEARCH_USERS_FOR_CHANNEL,
        data
      })
    )
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })

export const sendFirstDirectMessage = (params, callback) => dispatch => {
  let body = {
    ...params,
    timeStamp: Math.floor(Date.now() / 1000)
  }
  return request
    .post(`${API_URL}/channel/twoPeople`, body, auth())
    .then(response => {
      dispatch({
        type: CHAT.CREATE_NEW_DM_CHANNEL,
        data: response.data
      })
      return Promise.resolve(response.data)
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const submitMessageAsync = params => dispatch => {
  let message = {
    ...params,
    timeStamp: Math.floor(Date.now() / 1000)
  }
  dispatch({
    type: CHAT.SUBMIT_MESSAGE,
    message
  })
  return Promise.resolve(params)
}

export const saveMessage = (message, index) => dispatch => {
  return request
    .post(API_URL, { message }, auth())
    .then(response => {
      dispatch({
        type: CHAT.ADD_ID_TO_NEW_MESSAGE,
        messageIndex: index,
        messageId: response.data.messageId
      })
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
}

export const turnChatOff = () => dispatch => {
  dispatch({
    type: CHAT.CLOSE
  })
  return Promise.resolve()
}

export const uploadChatSubject = content => dispatch =>
  request
    .post(`${API_URL}/chatSubject`, { content }, auth())
    .then(response => {
      dispatch({
        type: CHAT.UPLOAD_SUBJECT,
        data: response.data
      })
      return Promise.resolve(response.data.subjectId)
    })
    .catch(error => {
      console.error(error.response || error)
      handleError(error, dispatch)
    })
