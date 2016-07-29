import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import Button from 'components/Button';
import {stringIsEmpty} from 'helpers/stringHelpers';

export default class CommentInputArea extends Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
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
              onChange={event => this.setState({text: event.target.value})}
            />
          </div>
          <div className="row">
            <Button
              className="btn btn-default btn-sm"
              disabled={stringIsEmpty(this.state.text)}
              onClick={this.onSubmit}
            >Submit</Button>
          </div>
        </div>
      </div>
    )
  }

  onSubmit() {
    if (!stringIsEmpty(this.state.text)) {
      this.props.onSubmit(this.state.text);
      this.setState({text: ''});
    }
  }
}
