import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

export default class CommentInputArea extends Component {
  state = {
    text: ''
  }
  render() {
    return (
      <div className="page-header">
        <h3>Comments</h3>
        <div className="container-fluid">
          <div className="row form-group">
            <Textarea
              className="form-control"
              rows={4}
              value={this.state.text}
              placeholder="Post your thoughts here."
              onChange={ e => this.setState({text: e.target.value}) }
            />
          </div>
          <div className="row">
            <button
              className="btn btn-default btn-sm"
              onClick={this.onSubmit.bind(this)}
            >Submit</button>
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
