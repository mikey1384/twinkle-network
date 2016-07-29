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
      <div className="media">
        <div className="media-body">
          <div className="container-fluid">
            <div className="row form-group">
              <Textarea
                autoFocus
                className="form-control"
                rows={4}
                value={this.state.text}
                placeholder="Post your reply."
                onChange={event => this.setState({text: event.target.value})}
              />
            </div>
            <div className="row">
              <Button
                className="btn btn-default btn-sm"
                disabled={stringIsEmpty(this.state.text)}
                onClick={this.onSubmit}
              >
                Submit
              </Button>
            </div>
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
