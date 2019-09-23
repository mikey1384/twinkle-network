import { initialChatState } from '../initialStates';

export default function ChatReducer(state, action) {
  switch (action.type) {
    case 'APPLY_CHANGED_CHANNEL_TITLE':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          title:
            state.currentChannel.id === action.data.channelId
              ? action.data.title
              : state.currentChannel.title
        },
        channels: state.channels.map(channel => {
          return {
            ...channel,
            channelName:
              channel.id === action.data.channelId
                ? action.data.title
                : channel.channelName
          };
        })
      };
    case 'CHANGE_SUBJECT': {
      return {
        ...state,
        subject: action.subject
      };
    }
    case 'CLEAR_CHAT_SEARCH_RESULTS':
      return {
        ...state,
        chatSearchResults: []
      };
    case 'CLEAR_LOADED_STATE': {
      return {
        ...state,
        loaded: false
      };
    }
    case 'CLEAR_NUM_UNREADS': {
      return {
        ...state,
        numUnreads: 0
      };
    }
    case 'CLEAR_RECENT_CHESS_MESSAGE': {
      return {
        ...state,
        recentChessMessage: undefined
      };
    }
    case 'CLEAR_SUBJECT_SEARCH_RESULTS':
      return {
        ...state,
        subjectSearchResults: []
      };
    case 'CLEAR_USER_SEARCH_RESULTS':
      return {
        ...state,
        userSearchResults: []
      };
    case 'CREATE_NEW_CHANNEL':
      return {
        ...state,
        subject: {},
        channels: [
          {
            id: action.data.message.channelId,
            channelName: action.data.message.channelName,
            lastMessage: {
              content: action.data.message.content,
              sender: {
                id: action.data.message.userId,
                username: action.data.message.username
              }
            },
            lastUpdate: action.data.message.timeStamp,
            numUnreads: 0
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
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(
          message => message.id !== action.messageId
        )
      };
    case 'DISPLAY_ATTACHED_FILE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.filePath === action.filePath
            ? {
                ...message,
                ...action.fileInfo,
                id: state.filesBeingUploaded[action.channelId]?.filter(
                  file => file.filePath === action.filePath
                )?.[0]?.id,
                fileToUpload: undefined
              }
            : message
        )
      };
    case 'EDIT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message => {
          return {
            ...message,
            content:
              message.id === action.data.messageId
                ? action.data.editedMessage
                : message.content
          };
        })
      };
    case 'ENTER_CHANNEL': {
      let loadMoreMessages = false;
      let originalNumUnreads = 0;
      const selectedChannel = action.data.channel;
      const uploadStatusMessages = state.filesBeingUploaded[
        selectedChannel.id
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreMessages = true;
      }
      action.data.messages.reverse();
      return {
        ...state,
        recentChessMessage: undefined,
        currentChannel: selectedChannel,
        channels: state.channels.reduce((prev, channel, index) => {
          if (channel.id === selectedChannel.id) {
            originalNumUnreads = channel.numUnreads;
          }
          if (action.showOnTop && index === state.channels.length - 1) {
            return [selectedChannel].concat(
              prev.concat(channel.id === selectedChannel.id ? [] : [channel])
            );
          }
          if (action.showOnTop && selectedChannel.id === channel.id) {
            return prev;
          }
          return prev.concat([
            {
              ...channel,
              numUnreads:
                channel.id === selectedChannel.id ? 0 : channel.numUnreads
            }
          ]);
        }, []),
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        selectedChannelId: selectedChannel.id,
        subject: action.channelId === 2 ? state.subject : {},
        loadMoreMessages
      };
    }
    case 'ENTER_EMPTY_CHAT':
      return {
        ...state,
        recentChessMessage: undefined,
        subject: {},
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: state.channels[0].members
        },
        messages: [],
        loadMoreMessages: false
      };
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      };
    case 'HIDE_CHAT':
      return {
        ...state,
        channels: state.channels.map(channel => {
          return {
            ...channel,
            isHidden: channel.id === action.channelId
          };
        })
      };
    case 'INCREASE_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: state.numUnreads + 1
      };
    case 'INIT_CHAT': {
      let loadMoreMessages = false;
      let originalNumUnreads = 0;
      let channelLoadMoreButton = false;
      const uploadStatusMessages = state.filesBeingUploaded[
        action.data.currentChannel.id
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages && action.data.messages.length === 21) {
        action.data.messages.pop();
        loadMoreMessages = true;
      }
      action.data.messages && action.data.messages.reverse();
      if (action.data.channels.length > 20) {
        action.data.channels.pop();
        channelLoadMoreButton = true;
      }
      return {
        ...initialChatState,
        loaded: true,
        channelLoadMoreButton,
        recentChessMessage: undefined,
        subject: action.data.currentChannel.id === 2 ? state.subject : {},
        currentChannel: action.data.currentChannel,
        selectedChannelId: action.data.currentChannel.id,
        channels: action.data.channels.reduce((resultingArray, channel) => {
          if (channel.id === action.data.currentChannel.id) {
            if (channel.id !== 2) originalNumUnreads = channel.numUnreads;
            return [
              {
                ...channel,
                numUnreads: 0
              }
            ].concat(resultingArray);
          }
          return resultingArray.concat([channel]);
        }, []),
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        loadMoreMessages
      };
    }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        currentChannel: {
          ...state.currentChannel,
          members: state.currentChannel.members.concat(
            action.data.selectedUsers.map(user => ({
              userId: user.id,
              username: user.username
            }))
          )
        },
        messages: state.messages.concat([action.data.message])
      };
    case 'LOAD_SUBJECT':
      return {
        ...state,
        subject: action.subject
      };
    case 'OPEN_NEW_TAB':
      return {
        ...state,
        recentChessMessage: undefined,
        subject: {},
        channels: [
          {
            id: 0,
            channelName: action.recepient.username,
            lastMessage: {
              content: null,
              sender: null
            },
            lastUpdate: null,
            members: [action.user, action.recepient],
            numUnreads: 0
          }
        ].concat(state.channels.filter(channel => channel.id !== 0)),
        selectedChannelId: 0,
        currentChannel: {
          id: 0,
          twoPeople: true,
          members: [action.user, action.recepient]
        },
        messages: [],
        loadMoreMessages: false,
        recepientId: action.recepient.id
      };
    default:
      return state;
  }
}
