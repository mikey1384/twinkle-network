import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';


export default class MessagesContainer extends Component {
  state = {
    fillerHeight: 0,
    scrollAtBottom: true,
    newUnseenMessage: false
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
    const loadedPrevMessage = !switchedChannel && prevProps.messages[0] !== this.props.messages[0];

    if (loadedPrevMessage) return;
    if (switchedChannel) return this.setFillerHeight();
    if (newMessageArrived) {
      let { messages, userId } = this.props;
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
    const content = ReactDOM.findDOMNode(this.refs.content);
    const containerHeight = container.offsetHeight;
    const contentHeight = content.offsetHeight;
    let state = contentHeight < containerHeight ?
    {fillerHeight: containerHeight - contentHeight} : {fillerHeight: 20};
    this.setState(state, () => {
      container.scrollTop = Math.max(container.offsetHeight, content.offsetHeight)
    })
  }

  render() {
    const { loadMoreButton } = this.props;
    return (
      <div>
        <div
          ref="messagesContainer"
          style={{
            overflow: 'scroll',
            position: 'absolute',
            top: '55px',
            bottom: '50px'
          }}
          onScroll={
            () => {
              const content = ReactDOM.findDOMNode(this.refs.content);
              const container = ReactDOM.findDOMNode(this.refs.messagesContainer);
              if (scrollIsAtTheBottom(content, container)) this.setState({newUnseenMessage: false})
            }
          }
        >
          <div>
            { loadMoreButton ?
              <div
                className="text-center"
                style={{
                  marginTop: '1em',
                  marginBottom: '2em'
                }}
              >
                <button
                  className="btn btn-info"
                  style={{width: '20%'}}
                  onClick={ this.onLoadMoreButtonClick.bind(this) }
                >Load More</button>
              </div> : <div style={{
                height: this.state.fillerHeight + 'px'
              }}></div>
            }
            <div ref="content">
              { this.renderMessages() }
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
          { this.state.newUnseenMessage &&
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
    const userId = this.props.userId;
    this.props.loadMoreMessages(userId, messageId, roomId);
  }

  renderMessages() {
    return this.props.messages.map((message, index) => {
      return (
        <div
          key={index}
          className="media"
          style={{
            minHeight: '64px',
            height: 'auto'
          }}
        >
          <div className="media-left">
            <a><img className="media-object" style={{width: '64px'}} src="/img/default.jpg"/></a>
          </div>
          <div className="media-body">
            <h5 className="media-heading">{message.username} <small>{moment.unix(message.timeposted).format("LLL")}</small></h5>
            <span dangerouslySetInnerHTML={{__html: message.content}}></span>
          </div>
        </div>
      )
    })
  }
}

const scrollIsAtTheBottom = (content, container) => {
  return content.offsetHeight === container.offsetHeight + container.scrollTop;
}
