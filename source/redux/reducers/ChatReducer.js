import CHAT from '../constants/Chat'

const defaultState = {
  chatMode: false,
  selectedChannelId: null,
  currentChannel: {},
  channels: [],
  messages: [],
  userSearchResults: [],
  chatSearchResults: [],
  loadMoreMessages: false,
  channelLoadMoreButton: false,
  partnerId: null,
  numUnreads: 0,
  msgsWhileInvisible: 0,
  subject: {},
  subjectSearchResults: []
}

export default function ChatReducer(state = defaultState, action) {
  let channelLoadMoreButton = false
  let loadMoreMessages
  let channels
  let originalNumUnreads = 0
  let channel = []
  switch (action.type) {
    case CHAT.ADD_ID_TO_NEW_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((message, index) => ({
          ...message,
          id: index === action.messageIndex ? action.messageId : message.id
        }))
      }
    case CHAT.APPLY_CHANGED_CHANNEL_TITLE:
      return {
        ...state,
        channels: state.channels.map(channel => {
          return {
            ...channel,
            channelName:
              channel.id === action.data.channelId
                ? action.data.title
                : channel.channelName
          }
        })
      }
    case CHAT.CHANGE_SUBJECT:
      return {
        ...state,
        subject: action.subject
      }
    case CHAT.CLEAR_CHAT_SEARCH_RESULTS:
      return {
        ...state,
        chatSearchResults: []
      }
    case CHAT.CLEAR_SUBJECT_SEARCH_RESULTS:
      return {
        ...state,
        subjectSearchResults: []
      }
    case CHAT.CLEAR_USER_SEARCH_RESULTS:
      return {
        ...state,
        userSearchResults: []
      }
    case CHAT.RESET_MSG_UNREADS_ON_TAB_SWITCH:
      return {
        ...state,
        numUnreads: Math.max(state.numUnreads - state.msgsWhileInvisible, 0),
        msgsWhileInvisible: 0
      }
    case CHAT.CREATE_NEW_CHANNEL:
      return {
        ...state,
        subject: {},
        channels: [
          {
            id: action.data.message.channelId,
            channelName: action.data.message.channelName,
            lastMessage: action.data.message.content,
            lastUpdate: action.data.message.timeStamp,
            lastMessageSender: {
              id: action.data.message.userId,
              username: action.data.message.username
            }
          }
        ].concat(state.channels),
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
    case CHAT.CREATE_NEW_DM_CHANNEL:
      return {
        ...state,
        subject: {},
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
    case CHAT.SELECT_CHANNEL: {
      return {
        ...state,
        subject: action.channelId === 2 ? state.subject : {},
        selectedChannelId: action.channelId
      }
    }
    case CHAT.DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(
          message => message.id !== action.messageId
        )
      }
    case CHAT.EDIT_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(message => {
          return {
            ...message,
            content:
              message.id === action.data.messageId
                ? action.data.editedMessage
                : message.content
          }
        })
      }
    case CHAT.ENTER_CHANNEL:
      loadMoreMessages = false
      if (action.data.messages.length === 21) {
        action.data.messages.pop()
        loadMoreMessages = true
      }
      action.data.messages.reverse()
      return {
        ...state,
        subject: action.data.channel.id === 2 ? state.subject : {},
        selectedChannelId: action.data.channel.id,
        currentChannel: action.data.channel,
        channels: state.channels.reduce((resultingArray, channel, index) => {
          if (channel.id === action.data.channel.id) {
            originalNumUnreads = channel.numUnreads
          }
          if (action.showOnTop && index === state.channels.length - 1) {
            return [action.data.channel].concat(
              resultingArray.filter(
                channel => channel.id !== action.data.channel.id
              )
            )
          }
          return resultingArray.concat([
            {
              ...channel,
              numUnreads:
                channel.id === action.data.channel.id ? 0 : channel.numUnreads
            }
          ])
        }, []),
        chatMode: true,
        messages: action.data.messages,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        loadMoreMessages
      }
    case CHAT.ENTER_EMPTY_CHAT:
      return {
        ...state,
        subject: {},
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: state.channels[0].members
        },
        messages: [],
        loadMoreMessages: false
      }
    case CHAT.GET_NUM_UNREAD_MSGS:
      return {
        ...state,
        numUnreads: action.numUnreads
      }
    case CHAT.HIDE_CHAT:
      return {
        ...state,
        channels: state.channels.map(channel => {
          return {
            ...channel,
            isHidden: channel.id === action.channelId
          }
        })
      }
    case CHAT.INCREASE_NUM_UNREAD_MSGS:
      return {
        ...state,
        numUnreads: state.numUnreads + 1
      }
    case CHAT.INIT:
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
        subject: action.data.currentChannel.id === 2 ? state.subject : {},
        chatMode: true,
        currentChannel: action.data.currentChannel,
        selectedChannelId: action.data.currentChannel.id,
        channels: action.data.channels.reduce((resultingArray, channel) => {
          if (channel.id === action.data.currentChannel.id) {
            if (channel.id !== 2) originalNumUnreads = channel.numUnreads
            return [
              {
                ...channel,
                numUnreads: 0
              }
            ].concat(resultingArray)
          }
          return resultingArray.concat([channel])
        }, []),
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        messages: action.data.messages,
        loadMoreMessages,
        userSearchResult: []
      }
    case CHAT.INVITE_USERS_TO_CHANNEL:
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
    case CHAT.LEAVE_CHANNEL:
      return {
        ...state,
        channels: state.channels.filter(
          channel => channel.id !== action.channelId
        )
      }
    case CHAT.LOAD_SUBJECT:
      return {
        ...state,
        subject: action.subject
      }
    case CHAT.LOAD_MORE_CHANNELS:
      if (action.data.length > 10) {
        action.data.pop()
        channelLoadMoreButton = true
      }
      return {
        ...state,
        channelLoadMoreButton,
        channels: state.channels.concat(action.data)
      }
    case CHAT.LOAD_MORE_MESSAGES:
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
    case CHAT.NOTIFY_MEMBER_LEFT:
      let timeStamp = Math.floor(Date.now() / 1000)
      return {
        ...state,
        channels: state.channels.map(
          channel =>
            channel.id === action.data.channelId
              ? {
                  ...channel,
                  lastUpdate: timeStamp,
                  lastMessageSender: {
                    id: action.data.userId,
                    username: action.data.username
                  },
                  numUnreads: 0,
                  lastMessage: 'Left the channel'
                }
              : channel
        ),
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.filter(
            member => member.userId !== action.data.userId
          )
        },
        messages: state.messages.concat([
          {
            id: null,
            channelId: action.data.channelId,
            content: 'Left the channel',
            timeStamp: timeStamp,
            isNotification: true,
            username: action.data.username,
            userId: action.data.userId,
            profilePicId: action.data.profilePicId
          }
        ])
      }
    case CHAT.OPEN_DM:
      if (action.messages.length > 20) {
        action.messages.pop()
        loadMoreMessages = true
      }
      channels = action.channels.length > 0 ? action.channels : state.channels
      return {
        ...state,
        subject: {},
        chatMode: true,
        channels: [
          {
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
          }
        ].concat(channels.filter(channel => channel.id !== action.channelId)),
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
    case CHAT.OPEN_NEW_TAB:
      let filteredChannel = state.channels.filter(channel => {
        return channel.id !== 0
      })
      return {
        ...state,
        subject: {},
        chatMode: true,
        channels: [
          {
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
          }
        ].concat(filteredChannel),
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
    case CHAT.RECEIVE_FIRST_MSG:
      return {
        ...state,
        subject: action.duplicate ? {} : state.subject,
        numUnreads:
          action.duplicate && action.pageVisible
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        selectedChannelId: action.duplicate
          ? action.data.channelId
          : state.selectedChannelId,
        currentChannel: action.duplicate
          ? {
              id: action.data.channelId,
              members: action.data.members,
              twoPeople: true
            }
          : state.currentChannel,
        messages: action.duplicate
          ? [
              {
                id: null,
                channelId: action.data.channelId,
                content: action.data.content,
                timeStamp: action.datatimeStamp,
                username: action.data.username,
                userId: action.data.userId,
                profilePicId: action.data.profilePicId
              }
            ]
          : state.messages,
        channels: [
          {
            id: action.data.channelId,
            channelName: action.data.channelName || action.data.username,
            lastMessage: action.data.content,
            lastUpdate: action.data.timeStamp,
            numUnreads: 1,
            lastMessageSender: {
              id: action.data.userId,
              username: action.data.username
            }
          }
        ].concat(
          state.channels.filter(
            (channel, index) => (action.duplicate ? index !== 0 : true)
          )
        )
      }
    case CHAT.RECEIVE_MESSAGE:
      return {
        ...state,
        numUnreads: action.pageVisible
          ? state.numUnreads
          : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
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
    case CHAT.RECEIVE_MSG_ON_DIFF_CHANNEL:
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
    case CHAT.RELOAD_SUBJECT:
      return {
        ...state,
        subject: action.subject,
        messages: state.messages.concat([action.message])
      }
    case CHAT.SEARCH:
      return {
        ...state,
        chatSearchResults: action.data
      }
    case CHAT.SEARCH_SUBJECT:
      return {
        ...state,
        subjectSearchResults: action.data
      }
    case CHAT.SEARCH_USERS_FOR_CHANNEL:
      return {
        ...state,
        userSearchResults: action.data
      }
    case CHAT.SUBMIT_MESSAGE:
      return {
        ...state,
        channels: state.channels.reduce((result, channel) => {
          return channel.id === action.message.channelId
            ? [
                {
                  ...channel,
                  lastMessage: action.message.content,
                  lastUpdate: Math.floor(Date.now() / 1000),
                  numUnreads: 0,
                  lastMessageSender: {
                    id: action.message.userId,
                    username: action.message.username
                  }
                }
              ].concat(result)
            : result.concat([channel])
        }, []),
        messages: state.messages.concat([
          {
            ...action.message,
            content: action.message.content
          }
        ])
      }
    case CHAT.CLOSE:
      return {
        ...state,
        chatMode: false
      }
    case CHAT.UPLOAD_SUBJECT:
      return {
        ...state,
        subject: action.data.subject,
        channels: state.channels.map(channel => ({
          ...channel,
          lastMessage:
            channel.id === 2
              ? action.data.subject.content
              : channel.lastMessage,
          lastMessageSender: {
            id: action.data.subject.userId,
            username: action.data.subject.username
          }
        })),
        messages: state.messages.concat([
          {
            id: action.data.subject.id,
            channelId: 2,
            ...action.data.subject
          }
        ])
      }
    case CHAT.RESET:
      return defaultState
    default:
      return state
  }
}
