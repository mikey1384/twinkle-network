import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import MessagesContainer from './MessagesContainer';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ChatActions from 'redux/actions/ChatActions';
import ChatInput from './ChatInput';
import CreateNewChannelModal from './Modals/CreateNewChannel';
import InviteUsersModal from './Modals/InviteUsers';
import EditTitleModal from './Modals/EditTitle';
import UserListModal from 'components/Modals/UserListModal';
import {cleanStringWithURL} from 'helpers/stringHelpers';
import SmallDropdownButton from 'components/SmallDropdownButton';
import Button from 'components/Button';
import ChatSearchBox from './ChatSearchBox';
import {GENERAL_CHAT_ID} from 'constants/database';

const channelName = (channels, currentChannel) => {
  for (let i = 0; i < channels.length; i ++) {
    if (channels[i].id === currentChannel.id) {
      return channels[i].channelName
    }
  }
  return null;
}

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    currentChannel: state.ChatReducer.currentChannel,
    channels: state.ChatReducer.channels,
    messages: state.ChatReducer.messages,
    loadMoreButton: state.ChatReducer.loadMoreButton,
    partnerId: state.ChatReducer.partnerId
  }),
  {
    receiveMessage: ChatActions.receiveMessage,
    receiveMessageOnDifferentChannel: ChatActions.receiveMessageOnDifferentChannel,
    receiveFirstMsg: ChatActions.receiveFirstMsg,
    enterChannelWithId: ChatActions.enterChannelWithId,
    enterEmptyChat: ChatActions.enterEmptyChat,
    submitMessage: ChatActions.submitMessageAsync,
    loadMoreMessages: ChatActions.loadMoreMessagesAsync,
    createNewChannel: ChatActions.createNewChannelAsync,
    createNewChatOrReceiveExistingChatData: ChatActions.checkChatExistsThenCreateNewChatOrReceiveExistingChatData,
    openNewChatTabOrEnterExistingChat: ChatActions.checkChatExistsThenOpenNewChatTabOrEnterExistingChat,
    hideChat: ChatActions.hideChatAsync,
    leaveChannel: ChatActions.leaveChannelAsync,
    editChannelTitle: ChatActions.editChannelTitle,
    notifyThatMemberLeftChannel: ChatActions.notifyThatMemberLeftChannel
  }
)
export default class Chat extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    onUnmount: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      currentChannelOnline: 1,
      createNewChannelModalShown: false,
      inviteUsersModalShown: false,
      userListModalShown: false,
      editTitleModalShown: false,
      myChannels: []
    }

    this.onCreateNewChannel = this.onCreateNewChannel.bind(this)
    this.onNewButtonClick = this.onNewButtonClick.bind(this)
    this.onMessageSubmit = this.onMessageSubmit.bind(this)
    this.onReceiveMessage = this.onReceiveMessage.bind(this)
    this.onChatInvitation = this.onChatInvitation.bind(this)
    this.renderUserListDescription = this.renderUserListDescription.bind(this)
    this.onInviteUsersDone = this.onInviteUsersDone.bind(this)
    this.onEditTitleDone = this.onEditTitleDone.bind(this)
    this.onHideChat = this.onHideChat.bind(this)
    this.onLeaveChannel = this.onLeaveChannel.bind(this)

    const {socket, notifyThatMemberLeftChannel} = props;
    socket.on('receive_message', this.onReceiveMessage)
    socket.on('chat_invitation', this.onChatInvitation)
    socket.on('change_in_members_online', data => {
      let {myChannels} = this.state;
      let forCurrentChannel = data.channelId === this.props.currentChannel.id;
      if (forCurrentChannel) {
        if (data.leftChannel) {
          const {userId, username} = data.leftChannel;
          notifyThatMemberLeftChannel({channelId: data.channelId, userId, username})
        }
        this.setState({currentChannelOnline: data.membersOnline.length})
      }

      let channelObjectExists = false;
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].channelId === data.channelId) {
          channelObjectExists = true;
          break;
        }
      }
      if (channelObjectExists) {
        this.setState({
          myChannels: myChannels.map(channel => {
            if (channel.channelId === data.channelId) {
              channel.membersOnline = data.membersOnline
            }
            return channel;
          })
        })
      } else {
        this.setState({
          myChannels: myChannels.concat([data])
        })
      }
    })
  }

  componentWillMount() {
    const {socket, channels} = this.props;
    for (let i = 0; i < channels.length; i ++) {
      let channelId = channels[i].id;
      socket.emit('check_online_members', channelId, (err, data) => {
        let {myChannels} = this.state;
        let forCurrentChannel = data.channelId === this.props.currentChannel.id;
        if (forCurrentChannel) {
          this.setState({currentChannelOnline: data.membersOnline.length})
        }
        let channelObjectExists = false;
        for (let i = 0; i < myChannels.length; i++) {
          if (myChannels[i].channelId === data.channelId) {
            channelObjectExists = true;
            break;
          }
        }
        if (channelObjectExists) {
          this.setState({
            myChannels: myChannels.map(channel => {
              if (channel.channelId === data.channelId) {
                channel.membersOnline = data.membersOnline
              }
              return channel;
            })
          })
        } else {
          this.setState({
            myChannels: myChannels.concat([data])
          })
        }
      });
    }
  }

  componentDidMount() {
    const {currentChannel} = this.props;
    const {myChannels} = this.state;
    let currentChannelOnline = 1;
    for (let i = 0; i < myChannels.length; i++) {
      if (myChannels[i].channelId === currentChannel.id) {
        currentChannelOnline = myChannels[i].membersOnline.length;
      }
    }
    this.setState({currentChannelOnline})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentChannel.id !== this.props.currentChannel.id) {
      ReactDOM.findDOMNode(this.refs.chatInput).focus()
    }
  }

  componentDidUpdate(prevProps) {
    const {currentChannel} = this.props;
    const {myChannels} = this.state;
    let currentChannelOnline = 1;
    if (prevProps.currentChannel.id !== this.props.currentChannel.id) {
      for (let i = 0; i < myChannels.length; i++) {
        if (myChannels[i].channelId === currentChannel.id) {
          currentChannelOnline = myChannels[i].membersOnline.length;
        }
      }
      this.setState({currentChannelOnline})
    }
  }

  componentWillUnmount() {
    const {socket, onUnmount} = this.props;
    socket.removeListener('receive_message', this.onReceiveMessage);
    socket.removeListener('chat_invitation', this.onChatInvitation);
    socket.removeListener('change_in_members_online');
    onUnmount();
  }

  render() {
    const {channels, currentChannel, userId, searchResult} = this.props;
    const {
      createNewChannelModalShown,
      inviteUsersModalShown,
      userListModalShown,
      editTitleModalShown,
      myChannels,
      searchText
    } = this.state;

    let menuProps = (currentChannel.twoPeople) ?
    [{label: 'Hide Chat', onClick: this.onHideChat}] :
    [{
     label: 'Invite People',
     onClick: () => this.setState({inviteUsersModalShown: true})
    },
    {
     label: 'Edit Channel Name',
     onClick: () => this.setState({editTitleModalShown: true})
    },
    {
     separator: true
    },
    {
     label: 'Leave Channel',
     onClick: this.onLeaveChannel
    }]

    return (
      <div style={{display: 'flex', height: '88%'}}>
        {createNewChannelModalShown &&
          <CreateNewChannelModal
            userId={userId}
            onHide={() => this.setState({createNewChannelModalShown: false})}
            onDone={this.onCreateNewChannel}
          />
        }
        {inviteUsersModalShown &&
          <InviteUsersModal
            onHide={() => this.setState({inviteUsersModalShown: false})}
            currentChannel={currentChannel}
            onDone={this.onInviteUsersDone}
          />
        }
        {editTitleModalShown &&
          <EditTitleModal
            title={channelName(channels, currentChannel)}
            onHide={() => this.setState({editTitleModalShown: false})}
            onDone={this.onEditTitleDone}
          />
        }
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            users={this.returnUsers(currentChannel, myChannels)}
            userId={userId}
            description={this.renderUserListDescription}
            descriptionColor='green'
          />
        }
        <div
          className="col-xs-3"
          style={{
            border: '1px solid #eee',
            marginLeft: '0.5em',
            paddingTop: '0.5em'
          }}
        >
          <div
            className="flexbox-container"
            style={{
              marginBottom: '1em',
              paddingBottom: '0.5em',
              borderBottom: '1px solid #eee'
            }}
          >
            <div className="text-center col-xs-8 col-xs-offset-2">
              <h4
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  overflow:'hidden',
                  lineHeight: 'normal',
                  marginBottom: '0px',
                  color: !channelName(channels, currentChannel) && '#7c7c7c'
                }}
              >{`${channelName(channels, currentChannel) || '(Deleted)'}`}</h4>
              {currentChannel.id !== 0 ?
                <small>
                  <a
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={() => this.setState({userListModalShown: true})}
                  >{this.renderNumberOfMembers()}</a> online
                </small> : <small>{'\u00a0'}</small>
              }
            </div>
            <Button
              className="btn btn-default btn-sm pull-right"
              onClick={this.onNewButtonClick}
            >+New</Button>
          </div>
          <ChatSearchBox />
          <div
            className="row"
            style={{
              marginTop: '1em',
              overflow: 'scroll',
              position: 'absolute',
              height: '75%',
              width: '100%'
            }}
          >
            {this.renderChannels()}
          </div>
        </div>
        <div
          className="col-xs-9 pull-right"
          style={{
            height: '100%',
            width: '73%',
            top: 0
          }}
        >
          {currentChannel.id !== GENERAL_CHAT_ID &&
            <SmallDropdownButton
              style={{
                position: "absolute",
                zIndex: 100,
                top: "0px",
                right: "0px"
              }}
              shape="button"
              menuProps={menuProps}
            />
          }
          <MessagesContainer
            ref="messagesContainer"
            currentChannelId={this.props.currentChannel.id}
            loadMoreButton={this.props.loadMoreButton}
            messages={this.props.messages}
            userId={this.props.userId}
            loadMoreMessages={this.props.loadMoreMessages}
          />
          <div
            style={{
              position: 'absolute',
              width: '95%',
              bottom: '10px'
            }}
          >
            <ChatInput
              ref="chatInput"
              currentChannelId={this.props.currentChannel.id}
              onMessageSubmit={this.onMessageSubmit}
            />
          </div>
        </div>
      </div>
    )
  }

  renderChannels() {
    const {userId, currentChannel, channels} = this.props;
    return channels.filter(channel => !channel.isHidden).map(channel => {
      const {lastMessageSender, lastMessage, id, channelName, numUnreads} = channel;
      return (
        <div
          className="media chat-channel-item container-fluid"
          style={{
            width: '100%',
            backgroundColor: id === currentChannel.id && '#f7f7f7',
            cursor: 'pointer',
            padding: '1em',
            marginTop: '0px'
          }}
          onClick={() => this.onChannelEnter(id)}
          key={id}
        >
          <div className="media-body">
            <h4
              className="media-heading"
              style={{color: !channelName && '#7c7c7c'}}
            >{`${channelName || '(Deleted)'}`}&nbsp;
              {id !== currentChannel.id && numUnreads > 0 &&
                <span className="badge">{numUnreads}</span>
              }
            </h4>
            <small
              style={{
                whiteSpace: 'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden',
                width: '25em',
                display: 'block'
              }}
            >
              <span style={{
                overflow:'hidden',
                lineHeight: 'normal',
                whiteSpace: 'nowrap'
              }}>
                {lastMessageSender && lastMessage ?
                  `${lastMessageSender.id == userId ? 'You' : lastMessageSender.username}: ${cleanStringWithURL(lastMessage)}` : '\u00a0'
                }
              </span>
            </small>
          </div>
        </div>
      )
    })
  }

  renderNumberOfMembers() {
    const {currentChannel} = this.props;
    const {currentChannelOnline} = this.state;
    const numberOfMembers = currentChannel.members.length;
    return `${currentChannelOnline}${numberOfMembers === 0 ? '' : '/' + numberOfMembers}`
  }

  renderUserListDescription(user) {
    const {userId, currentChannel} = this.props;
    const {myChannels} = this.state;

    if (user.userId === userId) return '(online)';

    const result = myChannels
      .filter(channel => channel.channelId === currentChannel.id)[0].membersOnline
      .map(member => member.userId).indexOf(user.userId) !== -1 && '(online)';
    return result;
  }

  returnUsers(currentChannel, myChannels) {
    let members = currentChannel.id === GENERAL_CHAT_ID ?
    myChannels.filter(channel => channel.channelId === currentChannel.id)[0]
      .membersOnline.map(member => ({username: member.username, userId: member.userId}))
    : currentChannel.members;
    return members.map(member => ({username: member.username, userId: member.userId}))
  }

  onMessageSubmit(message) {
    const {
      socket,
      submitMessage,
      userId,
      username,
      currentChannel,
      createNewChatOrReceiveExistingChatData,
      partnerId
    } = this.props;

    if (currentChannel.id === 0) {
      return createNewChatOrReceiveExistingChatData({message, userId, partnerId}, chat => {
        if (chat.alreadyExists) {
          let {message, messageId} = chat.alreadyExists;
          socket.emit('join_chat_channel', message.channelId);
          socket.emit('new_chat_message', {
            userId,
            username,
            content: message.content,
            channelId: message.channelId,
            id: messageId,
            timeStamp: message.timeStamp
          })
          return;
        }
        socket.emit('join_chat_channel', chat.channelId);
        socket.emit('send_bi_chat_invitation', partnerId, chat);
      })
    }

    let params = {
      userId,
      username,
      content: message,
      channelId: currentChannel.id
    }
    submitMessage(params, message => {
      socket.emit('new_chat_message', message);
    })
  }

  onNewButtonClick() {
    this.setState({createNewChannelModalShown: true})
  }

  onChannelEnter(id) {
    const {enterChannelWithId, enterEmptyChat} = this.props;
    if (id === 0) {
      this.setState({currentChannelOnline: 1})
      return enterEmptyChat()
    }
    enterChannelWithId(id)
  }

  onCreateNewChannel(params) {
    const {openNewChatTabOrEnterExistingChat, createNewChannel, socket, username, userId} = this.props;
    if (params.selectedUsers.length === 1) {
      const partner = params.selectedUsers[0];
      return openNewChatTabOrEnterExistingChat({username, userId}, partner, () => {
        this.setState({createNewChannelModalShown: false})
      })
    }

    createNewChannel(params, data => {
      const users = params.selectedUsers.map(user => {
        return user.userId;
      })
      socket.emit('join_chat_channel', data.message.channelId);
      socket.emit('send_group_chat_invitation', users, data);
      this.setState({createNewChannelModalShown: false})
      ReactDOM.findDOMNode(this.refs.chatInput).focus()
    })
  }

  onReceiveMessage(data) {
    const {receiveMessage, receiveMessageOnDifferentChannel, currentChannel, userId} = this.props;
    let messageIsForCurrentChannel = data.channelId === currentChannel.id;
    let senderIsNotTheUser = data.userId !== userId;
    if (messageIsForCurrentChannel && senderIsNotTheUser) {
      receiveMessage(data)
    }
    if (!messageIsForCurrentChannel) {
      receiveMessageOnDifferentChannel(data)
    }
  }

  onChatInvitation(data) {
    const {receiveFirstMsg, socket} = this.props;
    receiveFirstMsg(data);
    socket.emit('join_chat_channel', data.channelId);
  }

  onInviteUsersDone(users, message) {
    const {socket} = this.props;
    socket.emit('new_chat_message', {
      ...message,
      channelId: message.channelId
    });
    socket.emit('send_group_chat_invitation', users, {message: {...message, messageId: message.id}});
    this.setState({inviteUsersModalShown: false});
  }

  onEditTitleDone(title) {
    const {editChannelTitle, currentChannel} = this.props;
    editChannelTitle({title, channelId: currentChannel.id}, () => {
      this.setState({editTitleModalShown: false})
    });
  }

  onHideChat() {
    const {hideChat, currentChannel} = this.props;
    hideChat(currentChannel.id);
  }

  onLeaveChannel() {
    const {leaveChannel, currentChannel, userId, username, socket} = this.props;
    leaveChannel(currentChannel.id);
    socket.emit('leave_chat_channel', {channelId: currentChannel.id, userId, username});
  }
}
