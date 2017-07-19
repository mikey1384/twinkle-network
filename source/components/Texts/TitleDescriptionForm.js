import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Textarea from 'react-textarea-autosize'
import Button from 'components/Button'
import {stringIsEmpty} from 'helpers/stringHelpers'
import Input from './Input'

export default class TitleDescriptionForm extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    descriptionPlaceholder: PropTypes.string,
    onSubmit: PropTypes.func,
    rows: PropTypes.number,
    titlePlaceholder: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      title: '',
      description: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {autoFocus, rows, titlePlaceholder, descriptionPlaceholder} = this.props
    const {title, description} = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset className="form-group">
          <Input
            autoFocus={autoFocus}
            className="form-control"
            placeholder={titlePlaceholder}
            type="text"
            value={title}
            onChange={text => this.setState({title: text})}
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
    const {onSubmit} = this.props
    const {title, description} = this.state
    event.preventDefault()
    onSubmit(title, description)
    this.setState({
      title: '',
      description: ''
    })
  }
}
