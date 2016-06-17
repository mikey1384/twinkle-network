const defaultState = {
  currentChannelId: null,
  channels: [],
  messages: [],
  searchResult: [],
  loadMoreButton: false
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
      return {
        ...state,
        currentChannelId: action.data.currentChannelId,
        messages: action.data.messages,
        loadMoreButton
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
    default:
      return state;
  }
}
