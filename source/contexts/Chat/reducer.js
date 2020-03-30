import { initialChatState } from '.';

export default function ChatReducer(state, action) {
  switch (action.type) {
    case 'ADD_ID_TO_NEW_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((message, index) => ({
          ...message,
          id: index === action.messageIndex ? action.messageId : message.id
        }))
      };
    case 'EDIT_CHANNEL_SETTINGS':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            isClosed: action.isClosed
          }
        },
        customChannelNames: {
          ...state.customChannelNames,
          [action.channelId]: action.channelName
        }
      };
    case 'CHANGE_AWAY_STATUS': {
      return {
        ...state,
        ['user' + action.userId]: state['user' + action.userId]
          ? {
              ...state['user' + action.userId],
              isAway: action.isAway
            }
          : undefined
      };
    }
    case 'CHANGE_BUSY_STATUS': {
      return {
        ...state,
        ['user' + action.userId]: state['user' + action.userId]
          ? {
              ...state['user' + action.userId],
              isBusy: action.isBusy
            }
          : undefined
      };
    }
    case 'CHANGE_CHANNEL_OWNER': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            creatorId: action.newOwner.id,
            numUnreads: state.selectedChannelId === action.channelId ? 0 : 1,
            lastMessage: {
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            }
          }
        },
        messages:
          state.selectedChannelId === action.channelId
            ? state.messages.concat(action.message)
            : state.messages
      };
    }
    case 'CHANGE_CHANNEL_SETTINGS': {
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            channelName: action.channelName,
            isClosed: action.isClosed
          }
        }
      };
    }
    case 'CHANGE_SUBJECT': {
      return {
        ...state,
        subject: action.subject
      };
    }
    case 'CHANNEL_LOADING_DONE': {
      return {
        ...state,
        channelLoading: false
      };
    }
    case 'CLEAR_CHAT_SEARCH_RESULTS':
      return {
        ...state,
        chatSearchResults: []
      };
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
    case 'CONFIRM_CALL_RECEPTION':
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          callReceived: true
        }
      };
    case 'CREATE_NEW_CHANNEL': {
      const { channelId } = action.data.message;
      return {
        ...state,
        chatType: null,
        replyTarget: null,
        subject: {},
        homeChannelIds: [channelId].concat(state.homeChannelIds),
        classChannelIds: action.data.isClass
          ? [channelId].concat(state.classChannelIds)
          : state.classChannelIds,
        channelsObj: {
          ...state.channelsObj,
          [channelId]: {
            id: channelId,
            channelName: action.data.message.channelName,
            lastMessage: {
              content: action.data.message.content,
              sender: {
                id: action.data.message.userId,
                username: action.data.message.username
              }
            },
            lastUpdate: action.data.message.timeStamp,
            isClass: action.data.isClass,
            isClosed: action.data.isClosed,
            numUnreads: 0,
            twoPeople: false,
            creatorId: action.data.message.userId,
            members: action.data.members
          }
        },
        selectedChannelId: channelId,
        messages: [action.data.message],
        messagesLoadMoreButton: false
      };
    }
    case 'CREATE_NEW_DM_CHANNEL':
      return {
        ...state,
        subject: {},
        homeChannelIds: [
          action.message.channelId,
          ...state.homeChannelIds.filter(channelId => channelId !== 0)
        ],
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            id: action.message.channelId,
            lastMessage: {
              fileName: action.message.fileName || '',
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            lastUpdate: action.message.timeStamp,
            numUnreads: 0,
            twoPeople: true,
            members: action.members
          }
        },
        selectedChannelId: action.message.channelId,
        messages: [{ ...action.message }]
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
        messages: state.messages.map(message => {
          return message.filePath === action.filePath
            ? {
                ...message,
                ...action.fileInfo,
                id: state.filesBeingUploaded[action.channelId]?.filter(
                  file => file.filePath === action.filePath
                )?.[0]?.id,
                fileToUpload: undefined
              }
            : message;
        })
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
    case 'EDIT_WORD':
      return {
        ...state,
        wordsObj: {
          ...state.wordsObj,
          [action.word]: {
            ...state.wordsObj[action.word],
            deletedDefIds: action.deletedDefIds,
            partOfSpeechOrder: action.partOfSpeeches,
            definitionOrder: action.editedDefinitionOrder
          }
        }
      };
    case 'ENTER_CHANNEL': {
      let messagesLoadMoreButton = false;
      let originalNumUnreads = 0;
      const selectedChannel = action.data.channel;
      const uploadStatusMessages = state.filesBeingUploaded[
        selectedChannel.id
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages.length === 21) {
        action.data.messages.pop();
        messagesLoadMoreButton = true;
      }
      action.data.messages.reverse();
      return {
        ...state,
        chatType: null,
        replyTarget: null,
        recentChessMessage: undefined,
        channelsObj: {
          ...state.channelsObj,
          [selectedChannel.id]: selectedChannel
        },
        homeChannelIds: state.homeChannelIds.reduce(
          (prev, channelId, index) => {
            if (action.showOnTop && index === state.homeChannelIds.length - 1) {
              return [selectedChannel.id].concat(
                prev.concat(channelId === selectedChannel.id ? [] : [channelId])
              );
            }
            if (action.showOnTop && selectedChannel.id === channelId) {
              return prev;
            }
            return prev.concat([channelId]);
          },
          []
        ),
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        messagesLoaded: true,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        selectedChannelId: selectedChannel.id,
        subject: selectedChannel.id === 2 ? state.subject : {},
        messagesLoadMoreButton
      };
    }
    case 'ENTER_EMPTY_CHAT':
      return {
        ...state,
        chatType: null,
        replyTarget: null,
        recentChessMessage: undefined,
        subject: {},
        selectedChannelId: 0,
        messages: [],
        messagesLoadMoreButton: false
      };
    case 'GET_NUM_UNREAD_MSGS':
      return {
        ...state,
        numUnreads: action.numUnreads
      };
    case 'HANG_UP': {
      const newChannelOnCallMembers = { ...state.channelOnCall.members };
      delete newChannelOnCallMembers[action.memberId];
      const newPeerStreams = { ...state.peerStreams };
      if (!action.iHungUp) {
        delete newPeerStreams[action.peerId];
      }
      return {
        ...state,
        myStream: action.iHungUp ? null : state.myStream,
        peerStreams: action.iHungUp ? {} : newPeerStreams,
        channelOnCall: {
          ...state.channelOnCall,
          callReceived: action.iHungUp
            ? false
            : state.channelOnCall?.callReceived,
          outgoingShown: action.iHungUp
            ? false
            : state.channelOnCall?.outgoingShown,
          imCalling: action.iHungUp ? false : state.channelOnCall?.imCalling,
          imLive: action.iHungUp ? false : state.channelOnCall?.imLive,
          incomingShown: action.iHungUp
            ? false
            : state.channelOnCall?.incomingShown,
          members: newChannelOnCallMembers
        }
      };
    }
    case 'HIDE_ATTACHMENT':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.messageId
            ? { ...message, attachmentHidden: true }
            : message
        )
      };
    case 'HIDE_CHAT':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            ...state.channelsObj[action.channelId],
            isHidden: true
          }
        }
      };
    case 'INIT_CHAT': {
      let messagesLoadMoreButton = false;
      let originalNumUnreads = 0;
      let classLoadMoreButton = false;
      let homeLoadMoreButton = false;
      let vocabActivitiesLoadMoreButton = false;
      const uploadStatusMessages = state.filesBeingUploaded[
        action.data.currentChannelId
      ]?.filter(message => !message.uploadComplete);
      if (action.data.messages && action.data.messages.length === 21) {
        action.data.messages.pop();
        messagesLoadMoreButton = true;
      }
      action.data.messages?.reverse();
      if (action.data.homeChannelIds?.length > 20) {
        action.data.homeChannelIds.pop();
        homeLoadMoreButton = true;
      }
      if (action.data.classChannelIds?.length > 20) {
        action.data.classChannelIds.pop();
        classLoadMoreButton = true;
      }
      if (action.data.vocabActivities.length > 20) {
        action.data.vocabActivities.pop();
        vocabActivitiesLoadMoreButton = true;
      }
      action.data.vocabActivities?.reverse();

      return {
        ...initialChatState,
        chatType: action.data.chatType,
        loaded: true,
        classChannelIds: action.data.classChannelIds,
        homeChannelIds: action.data.homeChannelIds,
        channelsObj: {
          ...action.data.channelsObj,
          [action.data.currentChannelId]: {
            ...action.data.channelsObj[action.data.currentChannelId],
            numUnreads: 0
          }
        },
        classLoadMoreButton,
        homeLoadMoreButton,
        customChannelNames: action.data.customChannelNames,
        vocabActivities: action.data.vocabActivities,
        vocabActivitiesLoadMoreButton,
        messagesLoadMoreButton,
        messages: uploadStatusMessages
          ? [...action.data.messages, ...uploadStatusMessages]
          : action.data.messages,
        messagesLoaded: true,
        numUnreads: Math.max(state.numUnreads - originalNumUnreads, 0),
        recentChessMessage: undefined,
        reconnecting: false,
        selectedChannelId: action.data.currentChannelId,
        subject: action.data.currentChannelId === 2 ? state.subject : {},
        wordsObj: action.data.wordsObj,
        wordCollectors: action.data.wordCollectors
      };
    }
    case 'INVITE_USERS_TO_CHANNEL':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [state.selectedChannelId]: {
            ...state.channelsObj[state.selectedChannelId],
            members: state.channelsObj[state.selectedChannelId].members.concat(
              action.data.selectedUsers.map(user => ({
                id: user.id,
                username: user.username,
                profilePicId: user.profilePicId
              }))
            )
          }
        },
        messages: state.messages.concat([action.data.message])
      };
    case 'LEAVE_CHANNEL':
      return {
        ...state,
        messages: [],
        homeChannelIds: state.homeChannelIds.filter(
          channelId => channelId !== action.channelId
        )
      };
    case 'LOAD_MORE_CHANNELS': {
      let homeLoadMoreButton = false;
      let classLoadMoreButton = false;
      if (action.channelType === 'home' && action.channels.length > 20) {
        action.channels.pop();
        homeLoadMoreButton = true;
      }
      if (action.channelType === 'class' && action.channels.length > 20) {
        action.channels.pop();
        classLoadMoreButton = true;
      }
      const channels = {};
      for (let channel of action.channels) {
        channels[channel.id] = channel;
      }
      return {
        ...state,
        classLoadMoreButton,
        homeLoadMoreButton,
        [action.channelType === 'home'
          ? 'homeChannelIds'
          : 'classChannelIds']: state[
          action.channelType === 'home' ? 'homeChannelIds' : 'classChannelIds'
        ].concat(action.channels.map(channel => channel.id)),
        channelsObj: {
          ...state.channelsObj,
          ...channels
        }
      };
    }
    case 'LOAD_MORE_MESSAGES': {
      let messagesLoadMoreButton = false;
      if (action.data.length === 21) {
        action.data.pop();
        messagesLoadMoreButton = true;
      }
      action.data.reverse();
      return {
        ...state,
        messagesLoadMoreButton,
        messages: action.data.concat(state.messages)
      };
    }
    case 'LOAD_SUBJECT':
      return {
        ...state,
        subject: action.subject
      };
    case 'LOAD_VOCABULARY': {
      let vocabActivitiesLoadMoreButton = false;
      if (action.vocabActivities.length > 20) {
        action.vocabActivities.pop();
        vocabActivitiesLoadMoreButton = true;
      }
      action.vocabActivities?.reverse();
      return {
        ...state,
        selectedChannelId: null,
        chatType: 'vocabulary',
        messages: [],
        messagesLoadMoreButton: false,
        vocabActivities: action.vocabActivities,
        vocabActivitiesLoadMoreButton,
        wordsObj: action.wordsObj,
        wordCollectors: action.wordCollectors
      };
    }
    case 'LOAD_MORE_VOCABULARY': {
      let vocabActivitiesLoadMoreButton = false;
      if (action.vocabActivities.length > 20) {
        action.vocabActivities.pop();
        vocabActivitiesLoadMoreButton = true;
      }
      action.vocabActivities?.reverse();
      return {
        ...state,
        selectedChannelId: null,
        chatType: 'vocabulary',
        messages: [],
        messagesLoadMoreButton: false,
        vocabActivities: action.vocabActivities.concat(state.vocabActivities),
        vocabActivitiesLoadMoreButton,
        wordsObj: {
          ...state.wordsObj,
          ...action.wordsObj
        }
      };
    }
    case 'LOAD_WORD_COLLECTORS':
      return {
        ...state,
        wordCollectors: action.wordCollectors
      };
    case 'NEW_SUBJECT':
      return {
        ...state,
        subject: action.data.subject,
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            ...state.channelsObj[action.data.channelId],
            lastMessage: {
              content: action.data.subject.content,
              sender: {
                id: action.data.subject.userId,
                username: action.data.subject.username
              }
            }
          }
        },
        messages: state.messages.concat([
          {
            id: action.data.subject.id,
            channelId: action.data.channelId,
            ...action.data.subject
          }
        ])
      };
    case 'NOTIFY_MEMBER_LEFT': {
      let timeStamp = Math.floor(Date.now() / 1000);
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            ...state.channelsObj[action.data.channelId],
            lastUpdate: timeStamp,
            lastMessage: {
              content: 'Left this channel',
              sender: {
                id: action.data.userId,
                username: action.data.username
              }
            },
            numUnreads: 0,
            members: state.channelsObj[action.data.channelId].members.filter(
              member => member.id !== action.data.userId
            )
          }
        },
        messages: state.messages.concat([
          {
            id: null,
            channelId: action.data.channelId,
            content: 'Left this channel',
            timeStamp: timeStamp,
            isNotification: true,
            username: action.data.username,
            userId: action.data.userId,
            profilePicId: action.data.profilePicId
          }
        ])
      };
    }
    case 'OPEN_DM': {
      let messagesLoadMoreButton = false;
      if (action.messages.length > 20) {
        action.messages.pop();
        messagesLoadMoreButton = true;
      }
      return {
        ...state,
        chatType: null,
        loaded: true,
        recentChessMessage: undefined,
        replyTarget: null,
        subject: {},
        channelsObj: {
          ...state.channelsObj,
          [action.channelId]: {
            id: action.channelId,
            twoPeople: true,
            members: [action.user, action.recepient],
            channelName: action.recepient.username,
            lastMessage: action.lastMessage,
            lastUpdate: action.lastUpdate,
            numUnreads: 0
          }
        },
        homeChannelIds: [action.channelId].concat(
          state.homeChannelIds.filter(
            channelId => channelId !== action.channelId
          )
        ),
        selectedChannelId: action.channelId,
        messages: action.messages.reverse(),
        messagesLoadMoreButton,
        recepientId: action.recepient.id
      };
    }
    case 'OPEN_NEW_TAB':
      return {
        ...state,
        chatType: null,
        replyTarget: null,
        recentChessMessage: undefined,
        subject: {},
        homeChannelIds: [
          0,
          ...state.homeChannelIds.filter(channelId => channelId !== 0)
        ],
        selectedChannelId: 0,
        channelsObj: {
          ...state.channelsObj,
          '0': {
            id: 0,
            channelName: action.recepient.username,
            lastMessage: {
              content: null,
              sender: null
            },
            lastUpdate: null,
            members: [action.user, action.recepient],
            numUnreads: 0,
            twoPeople: true
          }
        },
        messages: [],
        messagesLoadMoreButton: false,
        recepientId: action.recepient.id
      };
    case 'POST_FILE_UPLOAD_STATUS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[
            action.channelId
          ]?.concat(action.file) || [action.file]
        }
      };
    case 'POST_UPLOAD_COMPLETE':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    id: action.messageId,
                    uploadComplete: action.result
                  }
                : file
          )
        }
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        messages: state.messages.concat([action.message]),
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            ...state.channelsObj[action.message.channelId],
            lastMessage: {
              fileName: action.message.fileName || '',
              gameWinnerId: action.message.gameWinnerId,
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            lastUpdate: action.message.timeStamp,
            members: [
              ...state.channelsObj[action.message.channelId].members,
              ...action.newMembers
            ],
            numUnreads: 0,
            isHidden: false
          }
        }
      };
    case 'RECEIVE_FIRST_MSG':
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
        channelsObj: {
          ...state.channelsObj,
          [action.data.channelId]: {
            id: action.data.channelId,
            members: action.data.members,
            twoPeople: true,
            channelName: action.data.channelName || action.data.username,
            lastMessage: {
              fileName: action.data.fileName || '',
              content: action.data.content,
              sender: {
                id: action.data.userId,
                username: action.data.username
              }
            },
            lastUpdate: action.data.timeStamp,
            numUnreads: 1
          }
        },
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
        homeChannelIds: [action.data.channelId].concat(
          state.homeChannelIds.filter((channelId, index) =>
            action.duplicate ? index !== 0 : true
          )
        )
      };
    case 'RECEIVE_MSG_ON_DIFF_CHANNEL':
      return {
        ...state,
        channelsObj: {
          ...state.channelsObj,
          [action.channel.id]: action.senderIsNotTheUser
            ? {
                ...state.channelsObj[action.channel.id],
                ...action.channel,
                numUnreads:
                  Number(
                    state.channelsObj[action.channel.id]?.numUnreads || 0
                  ) + 1
              }
            : state.channelsObj[action.channel.id]
        },
        numUnreads:
          action.pageVisible && action.usingChat
            ? state.numUnreads
            : state.numUnreads + 1,
        msgsWhileInvisible: action.pageVisible
          ? 0
          : state.msgsWhileInvisible + 1,
        homeChannelIds: [action.channel.id].concat(
          state.homeChannelIds.filter(
            channelId => channelId !== action.channel.id
          )
        )
      };
    case 'RECEIVE_VOCAB_ACTIVITY':
      return {
        ...state,
        vocabActivities: state.vocabActivities.concat(action.activity.content),
        wordsObj: {
          ...state.wordsObj,
          [action.activity.content]: action.activity
        }
      };
    case 'REGISTER_WORD':
      return {
        ...state,
        vocabActivities: state.vocabActivities.concat(action.word.content),
        wordsObj: {
          ...state.wordsObj,
          [action.word.content]: {
            ...state.wordsObj[action.word.content],
            ...action.word,
            isNewActivity: true
          }
        }
      };
    case 'RELOAD_SUBJECT':
      return {
        ...state,
        subject: action.subject,
        messages: state.messages.concat([action.message])
      };
    case 'REMOVE_NEW_ACTIVITY_STATUS':
      return {
        ...state,
        wordsObj: {
          ...state.wordsObj,
          [action.word]: {
            ...state.wordsObj[action.word],
            isNewActivity: false
          }
        }
      };
    case 'TOGGLE_PEER_STREAM': {
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          members: {
            ...state.channelOnCall.members,
            [action.peerId]: {
              ...state.channelOnCall.members[action.peerId],
              streamHidden: action.hidden
            }
          }
        }
      };
    }
    case 'RESET_CHAT':
      return initialChatState;
    case 'SEARCH':
      return {
        ...state,
        chatSearchResults: action.data
      };
    case 'SEARCH_SUBJECT':
      return {
        ...state,
        subjectSearchResults: action.data
      };
    case 'SEARCH_USERS_FOR_CHANNEL':
      return {
        ...state,
        userSearchResults: action.data
      };
    case 'SELECT_CHAT_TAB':
      return {
        ...state,
        chatType: action.selectedChatTab === 'class' ? null : state.chatType,
        selectedChatTab: action.selectedChatTab
      };
    case 'SET_CALL': {
      return {
        ...state,
        channelOnCall: action.channelId
          ? {
              imLive: action.imCalling,
              imCalling: action.imCalling,
              id: action.channelId,
              isClass: action.isClass,
              members: {}
            }
          : {}
      };
    }
    case 'SET_CHESS_MODAL_SHOWN':
      return {
        ...state,
        chessModalShown: action.shown
      };
    case 'SET_CREATING_NEW_DM_CHANNEL':
      return {
        ...state,
        creatingNewDMChannel: action.creating
      };
    case 'SET_CURRENT_CHANNEL_NAME':
      return {
        ...state,
        currentChannelName: action.channelName
      };
    case 'SET_IM_LIVE':
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          imLive: true
        }
      };
    case 'SET_VISIBLE': {
      const messageKey = 'message' + action.messageId;
      const prevMessageState = state[messageKey] || {};
      return {
        ...state,
        [messageKey]: {
          ...prevMessageState,
          visible: action.visible
        }
      };
    }
    case 'SET_LOADING_VOCABULARY':
      return {
        ...state,
        loadingVocabulary: action.loading
      };
    case 'SET_MEMBERS_ON_CALL':
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          members:
            Object.keys(action.members).length > 0
              ? {
                  ...state.channelOnCall.members,
                  ...action.members
                }
              : {}
        }
      };
    case 'SET_PLACEHOLDER_HEIGHT': {
      const messageKey = 'message' + action.messageId;
      const prevMessageState = state[messageKey] || {};
      return {
        ...state,
        [messageKey]: {
          ...prevMessageState,
          placeholderHeight: action.height
        }
      };
    }
    case 'SET_USER_DATA':
      return {
        ...state,
        ['user' + action.profile.id]: action.profile
      };
    case 'SET_MY_STREAM':
      return {
        ...state,
        myStream: action.stream
      };
    case 'SET_PEER_STREAMS':
      return {
        ...state,
        peerStreams: action.peerId
          ? {
              ...state.peerStreams,
              [action.peerId]: action.stream
            }
          : {}
      };
    case 'SET_RECONNECTING': {
      return {
        ...state,
        reconnecting: true
      };
    }
    case 'SET_REPLY_TARGET': {
      return {
        ...state,
        replyTarget: action.target
      };
    }
    case 'SET_VOCAB_ERROR_MESSAGE': {
      return {
        ...state,
        vocabErrorMessage: action.message
      };
    }
    case 'SET_WORDS_OBJECT': {
      return {
        ...state,
        wordsObj: {
          ...state.wordsObj,
          [action.wordObj.content]: {
            ...(state.wordsObj?.[action.wordObj.content] || {}),
            ...action.wordObj
          }
        }
      };
    }
    case 'SET_WORD_REGISTER_STATUS': {
      return {
        ...state,
        wordRegisterStatus: action.status
      };
    }
    case 'SHOW_INCOMING': {
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          incomingShown: true
        }
      };
    }
    case 'SHOW_OUTGOING': {
      return {
        ...state,
        channelOnCall: {
          ...state.channelOnCall,
          outgoingShown: true
        }
      };
    }
    case 'SUBMIT_MESSAGE':
      return {
        ...state,
        homeChannelIds: state.homeChannelIds.reduce((prev, channelId) => {
          const next =
            channelId === action.message.channelId
              ? [channelId].concat(prev)
              : prev.concat([channelId]);
          return next;
        }, []),
        channelsObj: {
          ...state.channelsObj,
          [action.message.channelId]: {
            ...state.channelsObj[action.message.channelId],
            lastMessage: {
              fileName: action.message.fileName || '',
              gameWinnerId: action.message.gameWinnerId,
              content: action.message.content,
              sender: {
                id: action.message.userId,
                username: action.message.username
              }
            },
            lastUpdate: Math.floor(Date.now() / 1000),
            numUnreads: 0
          }
        },
        messages: state.messages.concat([
          {
            ...action.message,
            content: action.message.content,
            targetMessage: action.replyTarget
          }
        ])
      };
    case 'UPDATE_UPLOAD_PROGRESS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    uploadProgress: action.progress
                  }
                : file
          )
        }
      };
    case 'UPDATE_CHESS_MOVE_VIEW_STAMP':
      return {
        ...state,
        messages: state.messages.map(message =>
          !message.moveViewTimeStamp
            ? { ...message, moveViewTimeStamp: Math.floor(Date.now() / 1000) }
            : message
        )
      };
    case 'UPDATE_CLIENT_TO_API_SERVER_PROGRESS':
      return {
        ...state,
        filesBeingUploaded: {
          ...state.filesBeingUploaded,
          [action.channelId]: state.filesBeingUploaded[action.channelId]?.map(
            file =>
              file.filePath === action.path
                ? {
                    ...file,
                    clientToApiServerProgress: action.progress
                  }
                : file
          )
        }
      };
    case 'UPDATE_COLLECTORS_RANKINGS':
      return {
        ...state,
        wordCollectors:
          action.data.rankings ||
          updateWordCollectorsRankings({
            collector: action.data,
            currentRankings: state.wordCollectors
          })
      };
    case 'UPDATE_RECENT_CHESS_MESSAGE':
      return {
        ...state,
        recentChessMessage: action.message
      };
    case 'UPDATE_SELECTED_CHANNEL_ID':
      return {
        ...state,
        chatType: null,
        channelLoading: true,
        messages: [],
        messagesLoaded: false,
        messagesLoadMoreButton: false,
        selectedChannelId: action.channelId
      };
    default:
      return state;
  }
}

function updateWordCollectorsRankings({
  collector,
  currentRankings: { all = [], top30s = [] }
}) {
  const newAllRankings = all
    .filter(ranker => ranker.username !== collector.username)
    .concat([collector]);
  newAllRankings.sort((a, b) => b.numWordsCollected - a.numWordsCollected);
  let newTop30s = top30s;
  if (collector.rank <= 30) {
    newTop30s = top30s
      .filter(ranker => ranker.username !== collector.username)
      .concat([collector]);
  }
  newTop30s.sort((a, b) => b.numWordsCollected - a.numWordsCollected);
  return { all: newAllRankings.slice(0, 30), top30s: newTop30s };
}
