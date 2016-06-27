const defaultState = {
  currentChannelId: null,
  channels: [],
  messages: [],
  searchResult: [],
  loadMoreButton: false,
  chatPartnerId: null
};

export default function ChatReducer(state = defaultState, action) {
  let loadMoreButton;
  switch(action.type) {
    case 'INIT_CHAT':
      loadMoreButton = false;
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreButton = true;
      }
      action.data.messages.reverse()
      return {
        ...state,
        currentChannelId: action.data.currentChannelId,
        channels: action.data.channels,
        messages: action.data.messages,
        loadMoreButton,
        searchResult: []
      };
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
    case 'RECEIVE_MSG':
      return {
        ...state,
        messages: state.messages.concat([action.data])
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
        currentChannelId: action.data.currentChannelId,
        messages: action.data.messages,
        loadMoreButton
      }
    case 'ENTER_EMPTY_BIDIRECTIONAL_CHAT':
      return {
        ...state,
        currentChannelId: 0,
        messages: [],
        loadMoreButton: false
      }
    case 'RECEIVE_FIRST_BIDIRECTIONAL_MSG':
      return {
        ...state,
        channels: [{
          id: action.data.roomid,
          roomname: action.data.username,
          lastMessage: action.data.content,
          lastUpdate: action.data.timeposted,
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
          roomname: action.username,
          lastMessage: null,
          lastUpdate: null,
          lastMessageSender: null
        }].concat(filteredChannel),
        currentChannelId: 0,
        messages: [],
        loadMoreButton: false,
        chatPartnerId: action.userId
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
        currentChannelId: action.data.roomid
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
      return state;
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
