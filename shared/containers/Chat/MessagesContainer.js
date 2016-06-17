import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

export default class MessagesContainer extends Component {
  state = {
    fillerHeight: 0
  }

  componentDidMount() {
    const containerHeight = ReactDOM.findDOMNode(this.refs.messagesContainer).getBoundingClientRect().height;
    const messagesHeight = ReactDOM.findDOMNode(this.refs.messages).getBoundingClientRect().height;
    if (messagesHeight < containerHeight) {
      this.setState({fillerHeight: containerHeight - messagesHeight})
    } else {
      ReactDOM.findDOMNode(this.refs.messagesContainer).scrollTop = messagesHeight;
    }
  }

  componentWillReceiveProps() {
    const scrollTop = ReactDOM.findDOMNode(this.refs.messagesContainer).scrollTop;
    const containerHeight = ReactDOM.findDOMNode(this.refs.messagesContainer).getBoundingClientRect().height;
    const messagesPlusFillerHeight = ReactDOM.findDOMNode(this.refs.messagesPlusFiller).getBoundingClientRect().height;
  }

  componentDidUpdate(prevProps) {
    const messagesPlusFillerHeight = ReactDOM.findDOMNode(this.refs.messagesPlusFiller).getBoundingClientRect().height;
    const containerHeight = ReactDOM.findDOMNode(this.refs.messagesContainer).getBoundingClientRect().height;
    const messagesHeight = ReactDOM.findDOMNode(this.refs.messages).getBoundingClientRect().height;
    if(prevProps.currentChannelId !== this.props.currentChannelId) console.log("new channel");
    if(prevProps.messages !== this.props.messages) console.log("new message")
  }

  render() {
    const { loadMoreButton } = this.props;
    return (
      <div
        ref="messagesContainer"
        style={{
          top: '55px',
          bottom: '50px',
          position: 'absolute',
          width: '95%',
          overflow: 'scroll'
        }}
      >
        <div ref="messagesPlusFiller">
          <div style={{height: this.state.fillerHeight + 'px'}}></div>
          <div
            ref="messages"
          >
            { loadMoreButton &&
              <div className="text-center">
                <button
                  className="btn btn-info"
                  style={{
                    marginTop: '1em',
                    marginBottom: '0.5em',
                    width: '20%'
                  }}
                  onClick={ this.onLoadMoreButtonClick.bind(this) }
                >Load More</button>
              </div>
            }
            { this.renderMessages() }
          </div>
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
            { message.content }
          </div>
        </div>
      )
    })
  }
}
