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
    case 'ENTER_EMPTY_TWO_PEOPLE_CHANNEL':
      return {
        ...state,
        currentChannelId: 0,
        messages: [],
        loadMoreButton: false
      }
    case 'OPEN_NEW_TWO_PEOPLE_CHANNEL':
      let filteredChannel = state.channels.filter(channel => {
        return channel.id !== 0
      })
      return {
        ...state,
        channels: [{
          id: 0,
          roomname: 'New Chat',
          lastMessage: null,
          lastUpdate: null,
          lastMessageSender: null
        }].concat(filteredChannel),
        currentChannelId: 0,
        messages: [],
        loadMoreButton: false,
        chatPartnerId: action.partnerId
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
