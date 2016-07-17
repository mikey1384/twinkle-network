import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessagesContainer from './MessagesContainer';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ChatActions from 'redux/actions/ChatActions';
import ChatInput from './ChatInput';
import CreateNewChannelModal from './Modals/CreateNewChannel';
import InviteUsersModal from './Modals/InviteUsers';
import UserListModal from 'components/Modals/UserListModal';
import {cleanStringWithURL} from 'helpers/StringHelper';
import SmallDropdownButton from 'components/SmallDropdownButton';
import {GENERAL_CHAT_ID} from 'constants/database';

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    currentChannel: state.ChatReducer.currentChannel,
    channels: state.ChatReducer.channels,
    messages: state.ChatReducer.messages,
    loadMoreButton: state.ChatReducer.loadMoreButton,
    chatPartnerId: state.ChatReducer.chatPartnerId
  }),
  {
    receiveMessage: ChatActions.receiveMessage,
    receiveMessageOnDifferentChannel: ChatActions.receiveMessageOnDifferentChannel,
    receiveFirstMsg: ChatActions.receiveFirstMsg,
    enterChannel: ChatActions.enterChannelAsync,
    enterEmptyBidirectionalChat: ChatActions.enterEmptyBidirectionalChat,
    submitMessage: ChatActions.submitMessageAsync,
    loadMoreMessages: ChatActions.loadMoreMessagesAsync,
    createNewChannel: ChatActions.createNewChannelAsync,
    createBidirectionalChannel: ChatActions.createBidirectionalChannelAsync,
    checkChannelExists: ChatActions.checkChannelExistsAsync,
    leaveChannel: ChatActions.leaveChannelAsync
  }
)
export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentChannelOnline: 1,
      createNewChannelModalShown: false,
      inviteUsersModalShown: false,
      userListModalShown: false,
      myChannels: []
    }

    this.onCreateNewChannel = this.onCreateNewChannel.bind(this)
    this.onNewButtonClick = this.onNewButtonClick.bind(this)
    this.onMessageSubmit = this.onMessageSubmit.bind(this)
    this.onReceiveMessage = this.onReceiveMessage.bind(this)
    this.onChatInvitation = this.onChatInvitation.bind(this)
    this.renderUserListDescription = this.renderUserListDescription.bind(this)
    this.onInviteUsersDone = this.onInviteUsersDone.bind(this)
    this.onLeaveChannel = this.onLeaveChannel.bind(this)

    const {socket} = props;
    socket.on('receive_message', this.onReceiveMessage)
    socket.on('chat_invitation', this.onChatInvitation)
    socket.on('change_in_members_online', data => {
      let {myChannels} = this.state;
      let forCurrentChannel = Number(data.channelId) === Number(this.props.currentChannel.id);
      if (forCurrentChannel) {
        this.setState({currentChannelOnline: data.membersOnline.length})
      }
      let channelObjectExists = false;
      for (let i = 0; i < myChannels.length; i++) {
        if (Number(myChannels[i].channelId) === Number(data.channelId)) {
          channelObjectExists = true;
          break;
        }
      }
      if (channelObjectExists) {
        this.setState({
          myChannels: myChannels.map(channel => {
            if (Number(channel.channelId) === Number(data.channelId)) {
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
        let forCurrentChannel = Number(data.channelId) === Number(this.props.currentChannel.id);
        if (forCurrentChannel) {
          this.setState({currentChannelOnline: data.membersOnline.length})
        }
        let channelObjectExists = false;
        for (let i = 0; i < myChannels.length; i++) {
          if (Number(myChannels[i].channelId) === Number(data.channelId)) {
            channelObjectExists = true;
            break;
          }
        }
        if (channelObjectExists) {
          this.setState({
            myChannels: myChannels.map(channel => {
              if (Number(channel.channelId) === Number(data.channelId)) {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentChannel.id !== this.props.currentChannel.id) {
      ReactDOM.findDOMNode(this.refs.chatInput).focus()
    }
  }

  componentWillUnmount() {
    const {socket, channels, onUnmount} = this.props;
    socket.removeListener('receive_message', this.onReceiveMessage);
    socket.removeListener('chat_invitation', this.onChatInvitation);
    socket.removeListener('change_in_members_online');
    onUnmount();
  }

  render() {
    const {channels, currentChannel, userId} = this.props;
    const {createNewChannelModalShown, inviteUsersModalShown, userListModalShown, myChannels} = this.state;
    const channelName = () => {
      for (let i = 0; i < channels.length; i ++) {
        if (Number(channels[i].id) === Number(currentChannel.id)) {
          return channels[i].roomname
        }
      }
      return null;
    }

    let menuProps = [];
    if (!currentChannel.bidirectional) {
      menuProps.push({
        label: 'Invite People',
        onClick: () => this.setState({inviteUsersModalShown: true})
      })
    }

    if (Number(currentChannel.creatorId) === Number(userId) && !currentChannel.bidirectional) {
      menuProps.push({
        label: 'Edit Title',
        onClick: () => console.log("edit channel title")
      })
    }

    if (menuProps.length > 0) {
      menuProps.push({
        separator: true
      })
    }

    if (currentChannel.bidirectional) {
      menuProps.push({
        label: 'Hide Chat',
        onClick: () => console.log("leave chat")
      })
    }
    else {
      menuProps.push({
        label: 'Leave Channel',
        onClick: this.onLeaveChannel
      })
    }

    return (
      <div style={{display: 'flex', height: '88%'}}>
        {createNewChannelModalShown &&
          <CreateNewChannelModal
            show
            userId={userId}
            onHide={() => this.setState({createNewChannelModalShown: false})}
            onDone={this.onCreateNewChannel}
          />
        }
        {inviteUsersModalShown &&
          <InviteUsersModal
            show
            onHide={() => this.setState({inviteUsersModalShown: false})}
            currentChannel={currentChannel}
            onDone={this.onInviteUsersDone}
          />
        }
        {userListModalShown &&
          <UserListModal
            show
            onHide={() => this.setState({userListModalShown: false})}
            users={this.returnUsers(currentChannel, myChannels)}
            userId={userId}
            description={this.renderUserListDescription}
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
                  marginBottom: '0px'
                }}
              >{channelName()}</h4>
              <small>
                <a
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => this.setState({userListModalShown: true})}
                >{this.renderNumberOfMembers()}</a> online</small>
            </div>
            <button
              className="btn btn-default btn-sm pull-right"
              onClick={this.onNewButtonClick}
            >+New</button>
          </div>
          {
            /*<div className="row container-fluid">
              <input
                className="form-control"
                placeholder="Search for channels / usernames"
              />
            </div>*/
          }
          <div
            className="row"
            style={{
              marginTop: '1em',
              overflow: 'scroll',
              position: 'absolute',
              height: '80%',
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
          {Number(currentChannel.id) !== GENERAL_CHAT_ID &&
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
              onMessageSubmit={this.onMessageSubmit}
            />
          </div>
        </div>
      </div>
    )
  }

  renderChannels() {
    const {userId, currentChannel, channels} = this.props;
    return channels.map(channel => {
      const {lastMessageSender, lastMessage, id, roomname, numUnreads} = channel;
      return (
        <div
          className="media chat-channel-item container-fluid"
          style={{
            width: '100%',
            backgroundColor: id == currentChannel.id && '#f7f7f7',
            cursor: 'pointer',
            padding: '1em',
            marginTop: '0px'
          }}
          onClick={() => this.onChannelEnter(id)}
          key={id}
        >
          <div className="media-body">
            <h4 className="media-heading">{roomname} {numUnreads > 0 &&
              <span className="badge">{numUnreads}</span>
            }</h4>
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

    if (Number(user.userId) === Number(userId)) return '(You)';

    const result = myChannels
      .filter(channel => Number(channel.channelId) === Number(currentChannel.id))[0].membersOnline
      .map(member => Number(member.userId)).indexOf(Number(user.userId)) !== -1 && '(Online)';
    return result;
  }

  returnUsers(currentChannel, myChannels) {
    let members = Number(currentChannel.id) === GENERAL_CHAT_ID ?
    myChannels.filter(channel => Number(channel.channelId) === Number(currentChannel.id))[0]
      .membersOnline.map(member => ({username: member.username, userid: member.userId}))
    : currentChannel.members;
    return members.map(member => ({username: member.username, userId: member.userid}))
  }

  onMessageSubmit(message) {
    const {
      socket,
      submitMessage,
      userId,
      username,
      currentChannel,
      createBidirectionalChannel,
      chatPartnerId
    } = this.props;

    if (currentChannel.id === 0) {
      return createBidirectionalChannel({message, userId, chatPartnerId}, chat => {
        if (chat.alreadyExists) {
          let {message, messageId} = chat.alreadyExists;
          socket.emit('join_chat_channel', message.roomid);
          socket.emit('new_chat_message', {
            userid: userId,
            username,
            content: message.content,
            channelId: message.roomid,
            id: messageId,
            timeposted: message.timeposted
          })
          return;
        }
        socket.emit('join_chat_channel', String(chat.roomid));
        socket.emit('send_bi_chat_invitation', chatPartnerId, chat);
      })
    }

    let params = {
      userid: userId,
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
    const {enterChannel, enterEmptyBidirectionalChat} = this.props;
    const {myChannels} = this.state;
    if (id === 0) {
      this.setState({currentChannelOnline: 1})
      return enterEmptyBidirectionalChat()
    }
    let currentChannelOnline = 1;
    for (let i = 0; i < myChannels.length; i++) {
      if (Number(myChannels[i].channelId) === Number(id)) {
        currentChannelOnline = myChannels[i].membersOnline.length;
      }
    }
    enterChannel(id, () => this.setState({currentChannelOnline}))
  }

  onCreateNewChannel(params) {
    const {checkChannelExists, createNewChannel, socket, username, userId} = this.props;
    if (params.selectedUsers.length === 1) {
      const partner = params.selectedUsers[0];
      return checkChannelExists({username, userId}, partner, () => {
        this.setState({createNewChannelModalShown: false})
      })
    }

    createNewChannel(params, data => {
      const users = params.selectedUsers.map(user => {
        return user.userId;
      })
      socket.emit('join_chat_channel', data.message.roomid);
      socket.emit('send_group_chat_invitation', users, data);
      this.setState({createNewChannelModalShown: false})
      ReactDOM.findDOMNode(this.refs.chatInput).focus()
    })
  }

  onReceiveMessage(data) {
    const {receiveMessage, receiveMessageOnDifferentChannel, currentChannel, userId} = this.props;
    let messageIsForCurrentChannel = Number(data.channelId) === Number(currentChannel.id);
    let senderIsNotTheUser = Number(data.userid) !== Number(userId);
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
    socket.emit('join_chat_channel', data.roomid);
  }

  onInviteUsersDone(users, message) {
    const {socket} = this.props;
    socket.emit('new_chat_message', {
      ...message,
      channelId: message.roomid
    });
    socket.emit('send_group_chat_invitation', users, {message: {...message, messageId: message.id}});
    this.setState({inviteUsersModalShown: false});
  }

  onLeaveChannel() {
    const {leaveChannel, currentChannel, socket} = this.props;
    leaveChannel(currentChannel.id);
    socket.emit('leave_chat_channel')
    // on other user's client side
    // 1. notification on the leaver's departure should be displayed
    // 2. total number of members on the left menu should be adjusted
    // 3. members online number should be adjusted
  }
}
