import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default class CommentInputArea extends Component {
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
                placeholder="Post your reply."
              />
            </div>
            <div className="row">
              <button className="btn btn-default btn-sm">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
