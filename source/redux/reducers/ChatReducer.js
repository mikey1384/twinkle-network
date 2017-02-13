import {processedStringWithURL} from 'helpers/stringHelpers'

const defaultState = {
  chatMode: false,
  selectedChannelId: null,
  currentChannel: {},
  channels: [],
  messages: [],
  userSearchResult: [],
  chatSearchResult: [],
  loadMoreMessages: false,
  loadMoreChannel: false,
  channelLoadMoreButton: false,
  partnerId: null,
  numUnreads: 0,
  pageVisible: true,
  msgsWhileInvisible: 0
}

export default function ChatReducer(state = defaultState, action) {
  let channelLoadMoreButton = false
  let loadMoreMessages
  let channels
  let originalNumUnreads = 0
  let channel = []
  switch (action.type) {
    case 'ADD_ID_TO_NEW_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message, index) => ({
          ...message,
          id: index === action.messageIndex ? action.messageId : message.id
        }))
      }
    case 'APPLY_CHANGED_CHANNEL_TITLE':
      return {
        ...state,
        channels: state.channels.map(channel => {
          return {
            ...channel,
            channelName: channel.id === action.data.channelId ? action.data.title : channel.channelName
          }
        })
      }
    case 'CLEAR_CHAT_SEARCH_RESULTS':
      return {
        ...state,
        chatSearchResult: []
      }
    case 'CLEAR_USER_SEARCH_RESULTS':
      return {
        ...state,
        userSearchResult: []
      }
    case 'CHANGE_PAGE_VISIBILITY':
      return {
        ...state,
        pageVisible: action.visible,
        numUnreads: Math.max(state.numUnreads - state.msgsWhileInvisible, 0),
        msgsWhileInvisible: 0
      }
    case 'CREATE_NEW_CHANNEL':
      return {
        ...state,
        channels: [{
          id: action.data.message.channelId,
          channelName: action.data.message.channelName,
          lastMessage: action.data.message.content,
          lastUpdate: action.data.message.timeStamp,
          lastMessageSender: {
            id: action.data.message.userId,
            username: action.data.message.username
          }
        }].concat(state.channels),
        selectedChannelId: action.data.message.channelId,
        currentChannel: {
          id: action.data.message.channelId,
          twoPeople: false,
          creatorId: action.data.message.userId,
          members: action.data.members
        },
        messages: [action.data.message],
        loadMoreMessages: false
      }
    case 'CREATE_NEW_CHAT':
      return {
        ...state,
        channels: state.channels.map(channel => {
          if (channel.id === 0) {
            channel = {
              ...channel,
              id: action.data.channelId,
              lastMessage: action.data.content,
              lastMessageSender: {
                id: action.data.userId,
                username: action.data.username
              },
              lastUpdate: action.data.timeStamp
            }
          }
          return channel
        }),
        selectedChannelId: action.data.channelId,
        currentChannel: {
          id: action.data.channelId,
          twoPeople: true,
          creatorId: action.data.userId,
          members: action.data.members
        },
        messages: [action.data]
      }
    case 'SELECT_CHANNEL': {
      return {
        ...state,
        selectedChannelId: action.channelId
      }
    }
    case 'DELETE_CHAT_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.messageId)
      }
    case 'EDIT_CHAT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message => {
          return {
            ...message,
            content: message.id === action.data.messageId ? action.data.editedMessage : message.content
          }
        })
      }
    case 'ENTER_CHANNEL':
      loadMoreMessages = false
      if (action.data.messages.length === 21) {
        action.data.messages.pop()
        loadMoreMessages = true
      }
      action.data.messages.reverse()
      return {
        ...state,
        selectedChannelId: action.data.channel.id,
        currentChannel: action.data.channel,
        channels: state.channels.reduce(
          (resultingArray, channel, index) => {
            if (channel.id === action.data.channel.id) {
              originalNumUnreads = channel.numUnreads
            }
            if (action.showOnTop && index === (state.channels.length - 1)) {
              return [action.data.channel].concat(
                resultingArray.filter(channel => channel.id !== action.data.channel.id)
              )
            }
            return resultingArray.concat([{
              ...channel,
              numUnreads: channel.id === action.data.channel.id ? 0 : channel.numUnreads
            }])
          }, []
        ),
        chatMode: true,
        messages: action.data.messages,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        loadMoreMessages
      }
    case 'ENTER_EMPTY_CHAT':
      return {
        ...state,
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: state.channels[0].members
        },
        messages: [],
        loadMoreMessages: false
      }
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      }
    case 'HIDE_CHAT':
      return {
        ...state,
        channels: state.channels.map(channel => {
          return {
            ...channel,
            isHidden: channel.id === action.channelId
          }
        })
      }
    case 'INCREASE_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: state.numUnreads + 1
      }
    case 'INIT_CHAT':
      loadMoreMessages = false
      if (action.data.messages && action.data.messages.length === 21) {
        action.data.messages.pop()
        loadMoreMessages = true
      }
      action.data.messages && action.data.messages.reverse()
      if (action.data.channels.length > 10) {
        action.data.channels.pop()
        channelLoadMoreButton = true
      }
      return {
        ...state,
        channelLoadMoreButton,
        chatMode: true,
        currentChannel: action.data.currentChannel,
        selectedChannelId: action.data.currentChannel.id,
        channels: action.data.channels.reduce(
          (resultingArray, channel) => {
            if (channel.id === action.data.currentChannel.id) {
              if (channel.id !== 2) originalNumUnreads = channel.numUnreads
              return [{
                ...channel,
                numUnreads: 0
              }].concat(resultingArray)
            }
            return resultingArray.concat([channel])
          }, []
        ),
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        messages: action.data.messages,
        loadMoreMessages,
        userSearchResult: []
      }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.concat(
            action.data.selectedUsers.map(user => ({
              userId: user.userId,
              username: user.username
            }))
          )
        },
        messages: state.messages.concat([action.data.message])
      }
    case 'LEAVE_CHANNEL':
      return {
        ...state,
        channels: state.channels.filter(channel => channel.id !== action.channelId)
      }
    case 'LOAD_CHANNEL_LIST':
      return {
        ...state,
        channels: action.data
      }
    case 'LOAD_MORE_CHANNELS':
      if (action.data.length > 10) {
        action.data.pop()
        channelLoadMoreButton = true
      }
      return {
        ...state,
        channelLoadMoreButton,
        channels: state.channels.concat(action.data)
      }
    case 'LOAD_MORE_MSG':
      loadMoreMessages = false
      if (action.data.length === 21) {
        action.data.pop()
        loadMoreMessages = true
      }
      action.data.reverse()
      return {
        ...state,
        loadMoreMessages,
        messages: action.data.concat(state.messages)
      }
    case 'NOTIFY_MEMBER_LEFT':
      let timeStamp = Math.floor(Date.now()/1000)
      return {
        ...state,
        channels: state.channels.map(channel => (
          (channel.id === action.data.channelId) ? {
            ...channel,
            lastUpdate: timeStamp,
            lastMessageSender: {
              id: action.data.userId,
              username: action.data.username
            },
            numUnreads: 0,
            lastMessage: 'Left the channel'
          } : channel)
        ),
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.filter(member => member.userId !== action.data.userId)
        },
        messages: state.messages.concat([{
          id: null,
          channelId: action.data.channelId,
          content: 'Left the channel',
          timeStamp: timeStamp,
          isNotification: true,
          username: action.data.username,
          userId: action.data.userId,
          profilePicId: action.data.profilePicId
        }])
      }
    case 'OPEN_CHAT_FOR_DM':
      if (action.messages.length > 20) {
        action.messages.pop()
        loadMoreMessages = true
      }
      channels = action.channels.length > 0 ? action.channels : state.channels
      return {
        ...state,
        chatMode: true,
        channels: [{
          id: action.channelId,
          channelName: action.partner.username,
          lastMessage: action.lastMessage,
          lastUpdate: action.lastUpdate,
          lastMessageSender: action.lastMessageSender,
          members: [
            {
              username: action.user.username,
              userId: action.user.userId
            },
            {
              username: action.partner.username,
              userId: action.partner.userId
            }
          ]
        }].concat(channels.filter(channel => channel.id !== action.channelId)),
        selectedChannelId: action.channelId,
        currentChannel: {
          id: action.channelId,
          twoPeople: true,
          members: [
            {
              username: action.user.username,
              userId: action.user.userId
            },
            {
              username: action.partner.username,
              userId: action.partner.userId
            }
          ]
        },
        messages: action.messages.reverse(),
        loadMoreMessages,
        partnerId: action.partner.userId
      }
    case 'OPEN_NEW_CHAT_TAB':
      let filteredChannel = state.channels.filter(channel => {
        return channel.id !== 0
      })
      return {
        ...state,
        chatMode: true,
        channels: [{
          id: 0,
          channelName: action.partner.username,
          lastMessage: null,
          lastUpdate: null,
          lastMessageSender: null,
          members: [
            {
              username: action.user.username,
              userId: action.user.userId
            },
            {
              username: action.partner.username,
              userId: action.partner.userId
            }
          ]
        }].concat(filteredChannel),
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: [
            {
              username: action.user.username,
              userId: action.user.userId
            },
            {
              username: action.partner.username,
              userId: action.partner.userId
            }
          ]
        },
        messages: [],
        loadMoreMessages: false,
        partnerId: action.partner.userId
      }
    case 'RECEIVE_FIRST_MSG':
      return {
        ...state,
        numUnreads: action.duplicate && state.pageVisible ? state.numUnreads : state.numUnreads + 1,
        msgsWhileInvisible: state.pageVisible ? 0 : state.msgsWhileInvisible + 1,
        selectedChannelId: action.duplicate ? action.data.channelId : state.selectedChannelId,
        currentChannel: action.duplicate ? {
          id: action.data.channelId,
          members: action.data.members,
          twoPeople: true
        } : state.currentChannel,
        messages: action.duplicate ? [{
          id: null,
          channelId: action.data.channelId,
          content: action.data.content,
          timeStamp: action.datatimeStamp,
          username: action.data.username,
          userId: action.data.userId,
          profilePicId: action.data.profilePicId
        }] : state.messages,
        channels: [{
          id: action.data.channelId,
          channelName: action.data.channelName || action.data.username,
          lastMessage: action.data.content,
          lastUpdate: action.data.timeStamp,
          numUnreads: 1,
          lastMessageSender: {
            id: action.data.userId,
            username: action.data.username
          }
        }].concat(state.channels.filter((channel, index) => action.duplicate ? index !== 0 : true))
      }
    case 'RECEIVE_MSG':
      return {
        ...state,
        numUnreads: state.pageVisible ? state.numUnreads : state.numUnreads + 1,
        msgsWhileInvisible: state.pageVisible ? 0 : state.msgsWhileInvisible + 1,
        messages: state.messages.concat([action.data]),
        channels: state.channels.map(channel => {
          if (channel.id === action.data.channelId) {
            channel = {
              ...channel,
              lastUpdate: action.data.timeStamp,
              lastMessageSender: {
                id: action.data.userId,
                username: action.data.username
              },
              numUnreads: 0,
              lastMessage: action.data.content,
              isHidden: false
            }
          }
          return channel
        })
      }
    case 'RECEIVE_MSG_ON_DIFFERENT_CHANNEL':
      channel = action.channel
      for (let i = 0; i < state.channels.length; i++) {
        if (state.channels[i].id === action.data.channelId) {
          channel[0].numUnreads = state.channels[i].numUnreads + 1
        }
      }
      return {
        ...state,
        numUnreads: state.numUnreads + 1,
        channels: channel.concat(
          state.channels.filter(channel => channel.id !== action.data.channelId)
        )
      }
    case 'SEARCH_CHAT':
      return {
        ...state,
        chatSearchResult: action.data
      }
    case 'SEARCH_USERS_FOR_CHANNEL':
      return {
        ...state,
        userSearchResult: action.data
      }
    case 'SUBMIT_MESSAGE':
      return {
        ...state,
        channels: state.channels.reduce((result, channel) => {
          return channel.id === action.message.channelId ?
            [{
              ...channel,
              lastMessage: action.message.content,
              lastUpdate: Math.floor(Date.now()/1000),
              numUnreads: 0,
              lastMessageSender: {
                id: action.message.userId,
                username: action.message.username
              }
            }].concat(result) : result.concat([channel])
        }, []),
        messages: state.messages.concat([{
          ...action.message,
          content: processedStringWithURL(action.message.content)
        }])
      }
    case 'TURN_CHAT_OFF':
      return {
        ...state,
        chatMode: false
      }
    case 'RESET_CHAT':
      return defaultState
    default:
      return state
  }
}
