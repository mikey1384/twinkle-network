import {processedStringWithURL} from 'helpers/stringHelpers';

const defaultState = {
  chatMode: false,
  selectedChannelId: null,
  currentChannel: {},
  channels: [],
  messages: [],
  userSearchResult: [],
  chatSearchResult: [],
  loadMoreButton: false,
  partnerId: null,
  numUnreads: 0
};

export default function ChatReducer(state = defaultState, action) {
  let loadMoreButton;
  switch(action.type) {
    case 'APPLY_CHANGED_CHANNEL_TITLE':
      return {
        ...state,
        channels: state.channels.map(channel => {
          if (channel.id === action.data.channelId) {
            channel.channelName = action.data.title;
          }
          return channel;
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
        loadMoreButton: false
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
          return channel;
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
    case 'ENTER_CHANNEL':
      loadMoreButton = false;
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreButton = true;
      }
      action.data.messages.reverse();
      return {
        ...state,
        selectedChannelId: action.data.channel.id,
        currentChannel: action.data.channel,
        channels: state.channels.reduce(
          (resultingArray, channel) => {
            if (channel.id === action.data.channel.id) {
              channel.numUnreads = 0;
              channel.isHidden = false;
              if (action.showOnTop) return [channel].concat(resultingArray)
            }
            return resultingArray.concat([channel])
          }, []
        ),
        chatMode: true,
        messages: action.data.messages,
        loadMoreButton
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
        loadMoreButton: false
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
          if (channel.id === action.channelId) {
            channel.isHidden = true
          }
          return channel;
        })
      }
    case 'INCREASE_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: state.numUnreads + 1
      }
    case 'INIT_CHAT':
      loadMoreButton = false;
      if (action.data.messages && action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreButton = true;
      }
      action.data.messages && action.data.messages.reverse()
      return {
        ...state,
        currentChannel: action.data.currentChannel,
        selectedChannelId: action.data.currentChannel.id,
        channels: action.data.channels.reduce(
          (resultingArray, channel) => {
            if (channel.id === action.data.currentChannel.id) {
              channel.numUnreads = 0;
              return [channel].concat(resultingArray)
            }
            return resultingArray.concat([channel])
          }, []
        ),
        messages: action.data.messages,
        loadMoreButton,
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
    case 'LOAD_MORE_MSG':
      loadMoreButton = false;
      if (action.data.length === 21) {
        action.data.pop();
        loadMoreButton = true;
      }
      action.data.reverse()
      return {
        ...state,
        loadMoreButton,
        messages: action.data.concat(state.messages)
      }
    case 'NOTIFY_MEMBER_LEFT':
      let timeStamp = Math.floor(Date.now()/1000);
      return {
        ...state,
        channels: state.channels.map(channel => {
          if (channel.id === action.data.channelId) {
            channel = {
              ...channel,
              lastUpdate: timeStamp,
              lastMessageSender: {
                id: action.data.userId,
                username: action.data.username
              },
              numUnreads: 0,
              lastMessage: "Left the channel"
            }
          }
          return channel;
        }),
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.filter(member => member.userId !== action.data.userId)
        },
        messages: state.messages.concat([{
          id: null,
          channelId: action.data.channelId,
          content: "Left the channel",
          timeStamp: timeStamp,
          isNotification: true,
          username: action.data.username,
          userId: action.data.userId,
          profilePicId: action.data.profilePicId
        }])
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
        loadMoreButton: false,
        partnerId: action.partner.userId
      }
    case 'RECEIVE_EXISTING_CHAT_DATA':
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
          return channel;
        }),
        selectedChannelId: action.data.channelId,
        currentChannel: {
          id: action.data.channelId,
          twoPeople: true
        }
      }
    case 'RECEIVE_FIRST_MSG':
      return {
        ...state,
        channels: [{
          id: action.data.channelId,
          channelName: action.data.channelName || action.data.username,
          lastMessage: action.data.content,
          lastUpdate: action.data.timeStamp,
          numUnreads: 1,
          lastMessageSender: {
            id: action.data.userID,
            username: action.data.username
          }
        }].concat(state.channels)
      }
    case 'RECEIVE_MSG':
      return {
        ...state,
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
          return channel;
        })
      }
    case 'RECEIVE_MSG_ON_DIFFERENT_CHANNEL':
      let channel = {};
      let channels = state.channels;
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].id === action.data.channelId) {
          channel = {
            ...channels[i],
            lastMessage: action.data.content,
            lastUpdate: action.data.timeStamp,
            numUnreads: channels[i].numUnreads + 1,
            lastMessageSender: {
              id: action.data.userId,
              username: action.data.username
            },
            isHidden: false
          }
        }
      }
      return {
        ...state,
        channels: [channel].concat(
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
        messages: state.messages.concat([{
          id: action.message.messageId,
          channelId: action.message.channelId,
          content: processedStringWithURL(action.message.content),
          timeStamp: action.message.timeStamp,
          username: action.message.username,
          userId: action.message.userId,
          profilePicId: action.message.profilePicId
        }])
      }
    case 'TOGGLE_CHAT':
      return {
        ...state,
        chatMode: !state.chatMode
      }
    case 'TURN_CHAT_ON':
      return {
        ...state,
        chatMode: true
      }
    case 'TURN_CHAT_OFF':
      return {
        ...state,
        chatMode: false
      }
    case 'UPDATE_CHANNEL_LIST':
      return {
        ...state,
        channels: action.data.channels
      }
    case 'RESET_CHAT':
      return defaultState;
    default:
      return state;
  }
}
