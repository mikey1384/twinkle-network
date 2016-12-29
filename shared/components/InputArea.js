import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Button from 'components/Button';
import Textarea from 'react-textarea-autosize';
import {stringIsEmpty} from 'helpers/stringHelpers';
import {scrollElementToCenter} from 'helpers/domHelpers';

export default class InputArea extends Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clickListenerState !== this.props.clickListenerState) {
      ReactDOM.findDOMNode(this.InputArea).focus();
      scrollElementToCenter(this.InputArea);
    }
  }

  render() {
    const {text} = this.state;
    const {placeholder, rows, autoFocus, formGroupStyle} = this.props;
    return (
      <div className="container-fluid">
        <div className="row form-group" style={!!formGroupStyle ? formGroupStyle : null}>
          <Textarea
            autoFocus={autoFocus}
            ref={ref => this.InputArea = ref}
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
