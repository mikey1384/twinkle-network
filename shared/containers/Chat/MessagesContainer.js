import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class MessagesContainer extends Component {
  state = {
    fillerHeight: 0,
    atBottom: false
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
    if (scrollTop + containerHeight - messagesPlusFillerHeight === 0) {
      this.setState({atBottom: true})
    };
  }

  componentDidUpdate() {
    const messagesPlusFillerHeight = ReactDOM.findDOMNode(this.refs.messagesPlusFiller).getBoundingClientRect().height;
    if (this.state.atBottom) {
      ReactDOM.findDOMNode(this.refs.messagesContainer).scrollTop = messagesPlusFillerHeight;
      this.setState({atBottom: false})
    }
  }

  render() {
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
            { this.renderMessages() }
          </div>
        </div>
      </div>
    )
  }
  renderMessages() {
    return this.props.messages.map(message => {
      return (
        <div
          key={message.id}
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
            <h5 className="media-heading">sonic</h5>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </div>
        </div>
      )
    })
  }
}
