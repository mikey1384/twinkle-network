import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import UsernameText from 'components/UsernameText';
import Button from 'components/Button';
import {Color} from 'constants/css';
import ProfilePic from 'components/ProfilePic';
import Loading from 'components/Loading';

const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight <= container.offsetHeight + container.scrollTop;
}

export default class MessagesContainer extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    currentChannelId: PropTypes.number.isRequired,
    loadMoreButton: PropTypes.bool,
    messages: PropTypes.array,
    loadMoreMessages: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      fillerHeight: 0,
      scrollAtBottom: true,
      newUnseenMessage: false,
      loadMoreButtonLock: false
    }
    this.onLoadMoreButtonClick = this.onLoadMoreButtonClick.bind(this)
  }

  componentDidMount() {
    this.setFillerHeight();
  }

  componentWillReceiveProps() {
    const content = ReactDOM.findDOMNode(this.refs.content);
    const container = ReactDOM.findDOMNode(this.refs.messagesContainer);
    this.setState({scrollAtBottom: scrollIsAtTheBottom(content, container)})
  }

  componentDidUpdate(prevProps, prevState) {
    const switchedChannel = prevProps.currentChannelId !== this.props.currentChannelId;
    const newMessageArrived = this.props.messages.length !== 0 && prevProps.messages !== this.props.messages;
    const loadedPrevMessage =
      !switchedChannel && prevProps.messages.length !== 0 && prevProps.messages[0] !== this.props.messages[0];

    if (loadedPrevMessage) return;
    if (switchedChannel) return this.setFillerHeight();
    if (newMessageArrived) {
      let {messages, userId} = this.props;
      let messageSenderId = messages[messages.length - 1].userId;
      if (messageSenderId === userId || this.state.scrollAtBottom) {
        this.setFillerHeight();
      }
      else {
        this.setState({newUnseenMessage: true})
      }
    }
  }

  setFillerHeight() {
    const container = ReactDOM.findDOMNode(this.refs.messagesContainer);
    const messages = ReactDOM.findDOMNode(this.refs.messages);
    const containerHeight = container.offsetHeight;
    const messagesHeight = messages.offsetHeight;
    let state = messagesHeight < containerHeight ?
    {fillerHeight: containerHeight - messagesHeight} : {fillerHeight: 20};
    this.setState(state, () => {
      container.scrollTop = Math.max(container.offsetHeight, messages.offsetHeight)
    })
  }

  render() {
    const {loadMoreButton, loading} = this.props;
    const {fillerHeight, newUnseenMessage} = this.state;
    return (
      <div>
        {!!loading &&
          <Loading />
        }
        <div
          ref="messagesContainer"
          style={{
            overflow: 'scroll',
            position: 'absolute',
            width: '100%',
            height: '92%',
            bottom: '50px',
            opacity: !!loading && '0.3'
          }}
          onScroll={
            () => {
              const content = ReactDOM.findDOMNode(this.refs.content);
              const container = ReactDOM.findDOMNode(this.refs.messagesContainer);
              if (scrollIsAtTheBottom(content, container)) this.setState({newUnseenMessage: false})
            }
          }
        >
          <div ref="content">
            {loadMoreButton ?
              <div
                style={{
                  marginBottom: '2em',
                  textAlign: 'center'
                }}
              >
                <Button
                  className="btn btn-success"
                  style={{width: '20%'}}
                  onClick={this.onLoadMoreButtonClick}
                >Load More</Button>
              </div>
              :
              <div style={{
                height: fillerHeight + 'px'
              }} />
            }
            <div ref="messages">
              {this.renderMessages()}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {newUnseenMessage &&
            <Button
              className="btn btn-warning"
              onClick={
                () => {
                  this.setState({newUnseenMessage: false})
                  const content = ReactDOM.findDOMNode(this.refs.content);
                  const container = ReactDOM.findDOMNode(this.refs.messagesContainer);
                  container.scrollTop = Math.max(container.offsetHeight, content.offsetHeight);
                }
              }
            >New Message</Button>
          }
        </div>
      </div>
    )
  }

  onLoadMoreButtonClick() {
    const messageId = this.props.messages[0].id;
    const channelId = this.props.messages[0].channelId;
    const {userId, loadMoreMessages} = this.props;
    const {loadMoreButtonLock} = this.state;
    if (!loadMoreButtonLock) {
      this.setState({loadMoreButtonLock: true})
      loadMoreMessages(userId, messageId, channelId, () => {
        this.setState({loadMoreButtonLock: false})
      });
    }
  }

  renderMessages() {
    const {messages} = this.props;
    return messages.map((message, index) => {
      let {isNotification} = message;
      let messageStyle = isNotification ? {color: Color.darkGray} : null;
      return (
        <div
          key={index}
          className="media"
          style={{
            minHeight: '64px',
            height: 'auto',
            width: '100%'
          }}
        >
          <ProfilePic size='4' userId={message.userId} profilePicId={message.profilePicId} />
          <div
            className="media-body"
            style={{
              width: '100%',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            <h5 className="media-heading" style={{position: 'absolute'}}>
              <UsernameText
                user={{
                  id: message.userId,
                  name: message.username || '(Deleted)'
                }} /> <small>{moment.unix(message.timeStamp).format("LLL")}</small>
            </h5>
            <div style={{paddingTop: '1.5em'}}>
              <span style={messageStyle} dangerouslySetInnerHTML={{__html: message.content}}></span>
            </div>
          </div>
        </div>
      )
    })
  }
}
