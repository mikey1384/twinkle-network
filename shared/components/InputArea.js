import React, {PropTypes, Component} from 'react';
import Button from 'components/Button';
import Textarea from 'react-textarea-autosize';
import {stringIsEmpty} from 'helpers/stringHelpers';

export default class InputArea extends Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {text} = this.state;
    const {placeholder, rows, autoFocus} = this.props;
    return (
      <div className="container-fluid">
        <div className="row form-group">
          <Textarea
            autoFocus={autoFocus}
            className="form-control"
            rows={rows}
            value={text}
            placeholder={placeholder}
            onChange={event => this.setState({text: event.target.value})}
          />
        </div>
        <div className="row">
          <Button
            className="btn btn-default btn-sm"
            disabled={stringIsEmpty(text)}
            onClick={this.onSubmit}
          >
            Submit
          </Button>
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
