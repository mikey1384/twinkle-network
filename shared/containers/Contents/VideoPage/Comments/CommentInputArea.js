import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default class CommentInputArea extends Component {
  render() {
    return (
      <div className="page-header">
        <h3>Comments</h3>
        <div className="container-fluid">
          <div className="row form-group">
            <Textarea
              className="form-control"
              rows={4}
              placeholder="Post your thoughts here."
            />
          </div>
          <div className="row">
            <button className="btn btn-default btn-sm">Submit</button>
          </div>
        </div>
      </div>
    )
  }
}
