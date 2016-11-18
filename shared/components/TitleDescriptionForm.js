import React, {Component} from 'react';
import Textarea from 'react-textarea-autosize';
import Button from 'components/Button';
import {stringIsEmpty} from 'helpers/stringHelpers';

export default class TitleDescriptionForm extends Component {
  constructor() {
    super()
    this.state = {
      title: '',
      description: ''
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const {autoFocus, onSubmit, rows, titlePlaceholder, descriptionPlaceholder} = this.props;
    const {title, description} = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset className="form-group">
          <input
            autoFocus={autoFocus}
            className="form-control"
            placeholder={titlePlaceholder}
            type="text"
            value={title}
            onChange={event => this.setState({title: event.target.value})}
          />
        </fieldset>
        <fieldset className="form-group">
          <Textarea
            className="form-control"
            minRows={rows}
            placeholder={descriptionPlaceholder}
            value={description}
            onChange={event => this.setState({description: event.target.value})}
          />
        </fieldset>
        <Button
          className="btn btn-default btn-sm"
          type="submit"
          disabled={!title || stringIsEmpty(title)}
        >
          Submit
        </Button>
      </form>
    )
  }

  onSubmit(event) {
    const {onSubmit} = this.props;
    const {title, description} = this.state;
    event.preventDefault();
    onSubmit(title, description)
    this.setState({
      title: '',
      description: ''
    })
  }
}
