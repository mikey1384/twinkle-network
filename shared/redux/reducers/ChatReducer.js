import {processedStringWithURL} from 'helpers/StringHelper';

const defaultState = {
  chatMode: false,
  currentChannel: {},
  channels: [],
  messages: [],
  searchResult: [],
  loadMoreButton: false,
  chatPartnerId: null,
  numUnreads: 0
};

export default function ChatReducer(state = defaultState, action) {
  let loadMoreButton;
  switch(action.type) {
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
    case 'INIT_CHAT':
      loadMoreButton = false;
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreButton = true;
      }
      action.data.messages.reverse()
      return {
        ...state,
        currentChannel: action.data.currentChannel,
        channels: action.data.channels.map(channel => {
          if (Number(channel.id) === Number(action.data.currentChannel.id)) {
            channel.numUnreads = 0;
          }
          return channel;
        }),
        messages: action.data.messages,
        loadMoreButton,
        searchResult: []
      };
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      };
    case 'INCREASE_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: state.numUnreads + 1
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
    case 'ENTER_CHANNEL':
      loadMoreButton = false;
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreButton = true;
      }
      action.data.messages.reverse();
      return {
        ...state,
        currentChannel: action.data.currentChannel,
        channels: state.channels.map(channel => {
          if (Number(channel.id) === Number(action.data.currentChannel.id)) {
            channel.numUnreads = 0
          }
          return channel;
        }),
        messages: action.data.messages,
        loadMoreButton
      }
    case 'ENTER_EMPTY_BIDIRECTIONAL_CHAT':
      return {
        ...state,
        currentChannel: {
          id: 0,
          bidirectional: true
        },
        messages: [],
        loadMoreButton: false
      }
    case 'SUBMIT_MESSAGE':
      return {
        ...state,
        messages: state.messages.concat([{
          id: action.message.messageId,
          roomid: action.message.channelId,
          content: processedStringWithURL(action.message.content),
          timeposted: action.message.timeposted,
          username: action.message.username,
          userid: action.message.userid
        }])
      }
    case 'RECEIVE_MSG_ON_DIFFERENT_CHANNEL':
      let channel = {};
      let channels = state.channels;
      for (let i = 0; i < channels.length; i++) {
        if (String(channels[i].id) === String(action.data.channelId)) {
          channel = {
            ...channels[i],
            lastMessage: action.data.content,
            lastUpdate: action.data.timeposted,
            numUnreads: Number(channels[i].numUnreads) + 1,
            lastMessageSender: {
              id: action.data.userid,
              username: action.data.username
            }
          }
        }
      }
      return {
        ...state,
        channels: [channel].concat(state.channels.filter(channel => {
          return String(channel.id) !== String(action.data.channelId)
        }))
      }
    case 'RECEIVE_MSG':
      return {
        ...state,
        messages: state.messages.concat([action.data]),
        channels: state.channels.map(channel => {
          if (Number(channel.id) === Number(action.data.channelId)) {
            channel = {
              ...channel,
              lastUpdate: action.data.timeposted,
              lastMessageSender: {
                id: action.data.userid,
                username: action.data.username
              },
              numUnreads: 0,
              lastMessage: action.data.content
            }
          }
          return channel;
        })
      }
    case 'RECEIVE_FIRST_MSG':
      return {
        ...state,
        channels: [{
          id: action.data.roomid,
          roomname: action.data.roomname || action.data.username,
          lastMessage: action.data.content,
          lastUpdate: action.data.timeposted,
          numUnreads: 1,
          lastMessageSender: {
            id: action.data.userid,
            username: action.data.username
          }
        }].concat(state.channels)
      }
    case 'OPEN_BIDIRECTIONAL_CHAT':
      let filteredChannel = state.channels.filter(channel => {
        return channel.id !== 0
      })
      return {
        ...state,
        channels: [{
          id: 0,
          roomname: action.partner.username,
          lastMessage: null,
          lastUpdate: null,
          lastMessageSender: null
        }].concat(filteredChannel),
        currentChannel: {
          id: 0,
          bidirectional: true,
          members: [
            {
              username: action.user.username,
              userid: action.user.userId
            },
            {
              username: action.partner.username,
              userid: action.partner.userId
            }
          ]
        },
        messages: [],
        loadMoreButton: false,
        chatPartnerId: action.partner.userId
      }
    case 'IF_BIDIRECTIONAL_CHANNEL_EXISTS':
      return {
        ...state,
        channels: state.channels.map(channel => {
          if (channel.id === 0) {
            channel = {
              ...channel,
              id: action.data.roomid,
              lastMessage: action.data.content,
              lastMessageSender: {
                id: action.data.userid,
                username: action.data.username
              },
              lastUpdate: action.data.timeposted
            }
          }
          return channel;
        }),
        currentChannel: {
          id: action.data.roomid,
          bidirectional: true
        }
      }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.concat(
            action.data.selectedUsers.map(user => ({
              userid: user.userId,
              username: user.username
            }))
          )
        },
        messages: state.messages.concat([action.data.message])
      }
    case 'CREATE_NEW_CHANNEL':
      return {
        ...state,
        channels: [{
          id: action.data.message.roomid,
          roomname: action.data.message.roomname,
          lastMessage: action.data.message.content,
          lastUpdate: action.data.message.timeposted,
          lastMessageSender: {
            id: action.data.message.userid,
            username: action.data.message.username
          }
        }].concat(state.channels),
        currentChannel: {
          id: action.data.message.roomid,
          bidirectional: false,
          creatorId: action.data.message.userid,
          members: action.data.members
        },
        messages: [{
          id: action.data.message.messageId,
          roomid: action.data.message.roomid,
          content: action.data.message.content,
          timeposted: action.data.message.timeposted,
          username: action.data.message.username,
          isNotification: action.data.message.isNotification
        }],
        loadMoreButton: false
      }
    case 'CREATE_BIDIRECTIONAL_CHANNEL':
      return {
        ...state,
        channels: state.channels.map(channel => {
          if (channel.id === 0) {
            channel = {
              ...channel,
              id: action.data.roomid,
              lastMessage: action.data.content,
              lastMessageSender: {
                id: action.data.userid,
                username: action.data.username
              },
              lastUpdate: action.data.timeposted
            }
          }
          return channel;
        }),
        currentChannel: {
          id: action.data.roomid,
          bidirectional: true,
          creatorId: action.data.userid,
          members: action.data.members
        },
        messages: [{
          id: action.data.messageId,
          roomid: action.data.roomid,
          content: action.data.content,
          timeposted: action.data.timeposted,
          username: action.data.username
        }]
      }
    case 'UPDATE_CHANNEL_LIST':
      return {
        ...state,
        channels: action.data.channels
      }
    case 'SEARCH_USERS_FOR_CHANNEL':
      return {
        ...state,
        searchResult: action.data
      }
    case 'CLEAR_RESULTS_FOR_CHANNEL':
      return {
        ...state,
        searchResult: []
      }
    case 'RESET_CHAT':
      return defaultState;
    default:
      return state;
  }
}
