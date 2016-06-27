import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MessagesContainer from './MessagesContainer';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ChatActions from 'redux/actions/ChatActions';
import ChatInput from './ChatInput';
import CreateNewChannelModal from './CreateNewChannelModal';
import {cleanStringWithURL} from 'helpers/StringHelper';

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    currentChannelId: state.ChatReducer.currentChannelId,
    channels: state.ChatReducer.channels,
    messages: state.ChatReducer.messages,
    loadMoreButton: state.ChatReducer.loadMoreButton,
    chatPartnerId: state.ChatReducer.chatPartnerId
  }),
  {
    receiveMessage: ChatActions.receiveMessage,
    receiveFirstBidirectionalMsg: ChatActions.receiveFirstBidirectionalMsg,
    enterChannel: ChatActions.enterChannelAsync,
    enterEmptyBidirectionalChat: ChatActions.enterEmptyBidirectionalChat,
    submitMessage: ChatActions.submitMessageAsync,
    loadMoreMessages: ChatActions.loadMoreMessagesAsync,
    createNewChannel: ChatActions.createNewChannelAsync,
    createBidirectionalChannel: ChatActions.createBidirectionalChannelAsync,
    checkChannelExists: ChatActions.checkChannelExistsAsync
  }
)
export default class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createNewChannelModalShown: false
    }
    const {socket, receiveMessage, receiveFirstBidirectionalMsg} = props;
    socket.on('incoming message', data => {
      if (data.channelId === this.props.currentChannelId) {
        receiveMessage(data)
      }
    })
    socket.on('incoming chat invitation', data => {
      receiveFirstBidirectionalMsg(data);
      socket.emit('join chat channel', data.roomid);
    })
    this.onCreateNewChannel = this.onCreateNewChannel.bind(this)
    this.onNewButtonClick = this.onNewButtonClick.bind(this)
    this.onMessageSubmit = this.onMessageSubmit.bind(this)
  }

  componentWillMount() {
    const {socket, channels} = this.props;
    for (let i = 0; i < channels.length; i ++) {
      let channelId = channels[i].id;
      socket.emit('join chat channel', channelId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentChannelId !== this.props.currentChannelId) {
      ReactDOM.findDOMNode(this.refs.chatInput).focus()
    }
  }

  componentWillUnmount() {
    const {socket, channels, onUnmount} = this.props;
    for (let i = 0; i < channels.length; i ++) {
      let channelId = channels[i].id;
      socket.emit('leave chat channel', channelId)
    }
    socket.removeListener('incoming message');
    socket.removeListener('incoming chat invitation');
    onUnmount();
  }

  render() {
    const {channels, currentChannelId, userId} = this.props;
    const {createNewChannelModalShown} = this.state;
    const channelName = () => {
      for (let i = 0; i < channels.length; i ++) {
        if (Number(channels[i].id) === Number(currentChannelId)) {
          return channels[i].roomname
        }
      }
      return null;
    }
    return (
      <div style={{display: 'flex'}}>
        {createNewChannelModalShown &&
          <CreateNewChannelModal
            show
            userId={userId}
            onHide={() => this.setState({createNewChannelModalShown: false})}
            onDone={this.onCreateNewChannel}
          />
        }
        <div className="col-xs-3">
          <div
            className="flexbox-container"
            style={{
              marginBottom: '1em',
              paddingBottom: '0.5em',
              borderBottom: '1px solid #eee'
            }}
          >
            <div className="text-center col-xs-8 col-xs-offset-2">
              <h4>{channelName()}</h4>
            </div>
            <button
              className="btn btn-default btn-sm pull-right"
              onClick={this.onNewButtonClick}
            >+ New</button>
          </div>
          <div className="row container-fluid">
            <input
              className="form-control"
              placeholder="Search for channels / usernames"
            />
          </div>
          <div
            className="row"
            style={{
              marginTop: '1em',
              height: '33em',
              overflow: 'scroll',
              border: '1px solid #eee'
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
            top: 0,
            position: 'absolute'
          }}
        >
          <MessagesContainer
            ref="messagesContainer"
            currentChannelId={this.props.currentChannelId}
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
    const {userId, currentChannelId, channels} = this.props;
    return channels.map(channel => {
      const {lastMessageSender, lastMessage, id, roomname} = channel;
      return (
        <div
          className="media chat-channel-item container-fluid"
          style={{
            backgroundColor: id == currentChannelId && '#f7f7f7',
            cursor: 'pointer',
            padding: '1em',
            marginTop: '0px'
          }}
          onClick={() => this.onChannelEnter(id)}
          key={id}
        >
          <div className="media-body">
            <h4 className="media-heading">{roomname}</h4>
            <small
              style={{
                whiteSpace: 'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden',
                width: '25em',
                display: 'block',
                lineHeight: 'normal'
              }}
            >
              <span style={{whiteSpace: 'pre-wrap'}}>
                {lastMessageSender && lastMessage ?
                  `${lastMessageSender.id == userId ? 'You' : lastMessageSender.username}: ${cleanStringWithURL(lastMessage)}` : ' '
                }
              </span>
            </small>
          </div>
        </div>
      )
    })
  }

  onMessageSubmit(message) {
    const {
      socket,
      submitMessage,
      userId,
      username,
      currentChannelId,
      createBidirectionalChannel,
      chatPartnerId
    } = this.props;

    if (currentChannelId === 0) {
      return createBidirectionalChannel({message, userId, chatPartnerId}, message => {
        socket.emit('join chat channel', String(message.roomid));
        socket.emit('invite user to bidirectional chat', chatPartnerId, message);
        //invite yourself and the chat partner to the socket channel, if they are online.
        //notification channel will be necessary here.
      })
    }

    let params = {
      userid: userId,
      username,
      content: message,
      channelId: currentChannelId
    }
    submitMessage(params, (messageId, timeposted) => {
      let data = {
        ...params,
        id: messageId,
        timeposted
      }
      socket.emit('new chat message', data);
    })
  }

  onNewButtonClick() {
    this.setState({createNewChannelModalShown: true})
  }

  onChannelEnter(id) {
    const {enterChannel, enterEmptyBidirectionalChat} = this.props;
    if (id === 0) {
      return enterEmptyBidirectionalChat()
    }
    enterChannel(id)
  }

  onCreateNewChannel(params) {
    const {checkChannelExists, createNewChannel} = this.props;
    if (params.selectedUsers.length === 1) {
      const {userId, username} = params.selectedUsers[0];
      return checkChannelExists(userId, username, () => {
        this.setState({createNewChannelModalShown: false})
      })
    }
    createNewChannel(params, () => {
      this.setState({createNewChannelModalShown: false})
    })
  }
}
