import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MessagesContainer from './MessagesContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChatActions from 'redux/actions/ChatActions';
import ChatInput from './ChatInput';
import CreateNewChatModal from './CreateNewChatModal';

@connect(
  state => ({
    userId: state.UserReducer.userId,
    username: state.UserReducer.username,
    currentChannelId: state.ChatReducer.currentChannelId,
    channels: state.ChatReducer.channels,
    messages: state.ChatReducer.messages,
    loadMoreButton: state.ChatReducer.loadMoreButton
  }),
  {
    receiveMessage: ChatActions.receiveMessage,
    enterChannel: ChatActions.enterChannelAsync,
    submitMessage: ChatActions.submitMessageAsync,
    loadMoreMessages: ChatActions.loadMoreMessagesAsync
  }
)
export default class Chat extends Component {
  constructor(props) {
    super()
    this.state = {
      currentChannelId: props.currentChannelId,
      createNewChatModalShown: false
    }
    const { socket, receiveMessage } = props;
    const callback = (function(data) {
      if (data.channelId === this.state.currentChannelId) {
        receiveMessage(data)
      }
    }).bind(this)
    socket.on('incoming message', callback)
  }

  componentWillReceiveProps(props) {
    this.setState({
      currentChannelId: props.currentChannelId
    })
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener('incoming message');
    this.props.onUnmount();
  }

  render() {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        { this.state.createNewChatModalShown &&
          <CreateNewChatModal show
            onHide={ () => this.setState({createNewChatModalShown: false}) }
          />
        }
        <div className="col-sm-3">
          <div
            className="row flexbox-container"
            style={{
              marginBottom: '1em',
              paddingBottom: '0.5em',
              borderBottom: '1px solid #eee'
            }}
          >
            <div className="text-center col-sm-8 col-sm-offset-2">
              <h4>Twinkle Chat</h4>
            </div>
            <button
              className="btn btn-default btn-sm pull-right"
              onClick={ this.onNewButtonClick.bind(this) }
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
              marginTop: '1em'
            }}
          >
            { this.renderChannels() }
          </div>
        </div>
        <div
          className="col-sm-9"
          style={{
            height: '100%',
            top: 0,
            position: 'absolute'
          }}
        >
          <MessagesContainer
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
              onMessageSubmit={this.onMessageSubmit.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }

  onMessageSubmit(message) {
    const { socket, submitMessage } = this.props;
    let params = {
      userid: this.props.userId,
      username: this.props.username,
      content: message,
      channelId: this.props.currentChannelId
    }
    submitMessage(params, (messageId, timeposted) => {
      let data = {
        ...params,
        id: messageId,
        timeposted
      }
      socket.emit('new message', data);
    })
  }

  renderChannels() {
    const { userId, currentChannelId } = this.props;
    return this.props.channels.map(channel => {
      const { lastMessageSender, lastMessage, id, roomname } = channel;
      return (
        <div
          className="media chat-channel-item container-fluid"
          style={{
            backgroundColor: id == currentChannelId && '#f7f7f7',
            cursor: 'pointer',
            padding: '1em',
            marginTop: '0px'
          }}
          onClick={ () => this.onChannelEnter(id) }
          key={id}
        >
          <div
            className="media-body"
          >
            <h4 className="media-heading">{roomname}</h4>
            <small>{`${lastMessageSender.id == userId ? 'You' : lastMessageSender.username}: ${lastMessage}`}</small>
          </div>
        </div>
      )
    })
  }

  onNewButtonClick() {
    this.setState({createNewChatModalShown: true})
  }

  onChannelEnter(id) {
    const { enterChannel } = this.props;
    enterChannel(id)
  }
}
