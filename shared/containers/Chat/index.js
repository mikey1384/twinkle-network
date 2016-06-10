import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MessagesContainer from './MessagesContainer';
import Textarea from 'react-textarea-autosize';
import { connect } from 'react-redux';
import * as ChatActions from 'redux_helpers/actions/ChatActions';

@connect()
export default class Chat extends Component {
  state = {
    messages: [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
    ]
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(ChatActions.openChat())
  }

  render() {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        <div className="col-sm-3">
          <div
            className="row flexbox-container"
            style={{
              marginBottom: '1em',
              paddingBottom: '0.5em',
              borderBottom: '1px solid #eee'
            }}
          >
            <div className="text-center col-sm-12 col-sm-offset-2">
              <h4>Twinkle Chat</h4>
            </div>
            <button className="btn btn-default btn-sm pull-right">+ New</button>
          </div>
          <div className="row container-fluid">
            <input
              className="form-control"
              placeholder="Search for channels / usernames"
            />
          </div>
          <div className="row container-fluid">
            <div class="media">
              <br />
              <div className="media-body">
                <h4 className="media-heading">General</h4>
                <small>So this is what we talked about</small>
              </div>
            </div>
            <div class="media">
              <hr />
              <div className="media-body">
                <h4 className="media-heading">Programming Class</h4>
                <small>So this is what we talked about</small>
              </div>
            </div>
            <div class="media">
              <hr />
              <div className="media-body">
                <h4 className="media-heading">Harry, Sonic, Brandon</h4>
                <small>So this is what we talked about</small>
              </div>
            </div>
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
            messages={this.state.messages}
          />
          <div
            style={{
              position: 'absolute',
              width: '95%',
              bottom: '10px'
            }}
          >
            <Textarea
              rows={1}
              className="form-control"
              placeholder="Type a message..."
              onKeyDown={ this.onMessageSubmit.bind(this)}
              autoFocus
            />
          </div>
        </div>
      </div>
    )
  }
  onMessageSubmit(event) {
    const shiftKeyPressed = event.shiftKey;
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed && !shiftKeyPressed) {
      event.preventDefault();
      const newMessage = {
        id: this.state.messages.length + 1
      }
      this.setState({messages: this.state.messages.concat([newMessage])})
    }
  }
}
