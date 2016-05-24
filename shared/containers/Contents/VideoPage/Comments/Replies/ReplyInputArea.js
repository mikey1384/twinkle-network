import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default class CommentInputArea extends Component {
  state = {
    text: ''
  }
  render() {
    return (
      <div
        className="media"
      >
        <div className="media-body">
          <div className="container-fluid">
            <div className="row form-group">
              <Textarea
                autoFocus
                className="form-control"
                rows={4}
                value={this.state.text}
                placeholder="Post your reply."
                onChange={ e => this.setState({text: e.target.value}) }
              />
            </div>
            <div className="row">
              <button
                className="btn btn-default btn-sm"
                onClick={ this.onSubmit.bind(this) }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  onSubmit() {
    this.props.onSubmit(this.state.text);
    this.setState({text: ''});
  }
}
