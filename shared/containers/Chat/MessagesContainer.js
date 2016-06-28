import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';


const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight === container.offsetHeight + container.scrollTop;
}

export default class MessagesContainer extends Component {
  constructor() {
    super()
    this.state = {
      fillerHeight: 0,
      scrollAtBottom: true,
      newUnseenMessage: false
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
    const content = ReactDOM.findDOMNode(this.refs.content);
    const container = ReactDOM.findDOMNode(this.refs.messagesContainer);

    const switchedChannel = prevProps.currentChannelId !== this.props.currentChannelId;
    const newMessageArrived = this.props.messages.length !== 0 && prevProps.messages !== this.props.messages;
    const loadedPrevMessage =
      !switchedChannel && prevProps.messages.length !== 0 && prevProps.messages[0] !== this.props.messages[0];

    if (loadedPrevMessage) return;
    if (switchedChannel) return this.setFillerHeight();
    if (newMessageArrived) {
      let {messages, userId} = this.props;
      let messageSenderId = messages[messages.length - 1].userid;
      if (messageSenderId === userId || this.state.scrollAtBottom) {
        container.scrollTop = Math.max(container.offsetHeight, content.offsetHeight);
      }
      else {
        this.setState({newUnseenMessage: true})
      }
    }
  }

  setFillerHeight = () => {
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
    const {loadMoreButton} = this.props;
    const {fillerHeight, newUnseenMessage} = this.state;
    return (
      <div>
        <div
          ref="messagesContainer"
          style={{
            overflow: 'scroll',
            position: 'absolute',
            width: '100%',
            height: '90%'
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
                  marginTop: '1em',
                  marginBottom: '2em',
                  textAlign: 'center'
                }}
              >
                <button
                  className="btn btn-info"
                  style={{width: '20%'}}
                  onClick={this.onLoadMoreButtonClick}
                >Load More</button>
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
            <button
              className="btn btn-warning"
              onClick={
                () => {
                  this.setState({newUnseenMessage: false})
                  const content = ReactDOM.findDOMNode(this.refs.content);
                  const container = ReactDOM.findDOMNode(this.refs.messagesContainer);
                  container.scrollTop = Math.max(container.offsetHeight, content.offsetHeight);
                }
              }
            >New Message</button>
          }
        </div>
      </div>
    )
  }

  onLoadMoreButtonClick() {
    const messageId = this.props.messages[0].id;
    const roomId = this.props.messages[0].roomid;
    const {userId, loadMoreMessages} = this.props;
    loadMoreMessages(userId, messageId, roomId);
  }

  renderMessages() {
    const {messages} = this.props;
    return messages.map((message, index) => {
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
          <div className="media-left">
            <a><img className="media-object" style={{width: '64px'}} src="/img/default.jpg"/></a>
          </div>
          <div
            className="media-body"
            style={{
              width: '100%',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            <h5 className="media-heading">{message.username} <small>{moment.unix(message.timeposted).format("LLL")}</small></h5>
            <span dangerouslySetInnerHTML={{__html: message.content}}></span>
          </div>
        </div>
      )
    })
  }
}
