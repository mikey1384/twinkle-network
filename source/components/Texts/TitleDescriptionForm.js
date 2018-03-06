import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import Button from 'components/Button'
import { stringIsEmpty, addEmoji, finalizeEmoji } from 'helpers/stringHelpers'
import Input from './Input'

export default class TitleDescriptionForm extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    descriptionPlaceholder: PropTypes.string,
    onClose: PropTypes.func,
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
    const {
      autoFocus,
      onClose,
      rows,
      titlePlaceholder,
      descriptionPlaceholder
    } = this.props
    const { title, description } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <Input
          autoFocus={autoFocus}
          placeholder={titlePlaceholder}
          type="text"
          value={title}
          onChange={text => this.setState({ title: text })}
          onKeyUp={event =>
            this.setState({ title: addEmoji(event.target.value) })
          }
        />
        <div style={{ position: 'relative' }}>
          <Textarea
            style={{ marginTop: '1rem' }}
            minRows={rows}
            placeholder={descriptionPlaceholder}
            value={description}
            onChange={event =>
              this.setState({ description: event.target.value })
            }
          />
        </div>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            transparent
            style={{ fontSize: '1.7rem', marginRight: '1rem' }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            primary
            style={{ fontSize: '1.7rem' }}
            type="submit"
            disabled={!title || stringIsEmpty(title)}
          >
            Submit
          </Button>
        </div>
      </form>
    )
  }

  onSubmit(event) {
    const { onSubmit } = this.props
    const { title, description } = this.state
    event.preventDefault()
    onSubmit(finalizeEmoji(title), finalizeEmoji(description))
    this.setState({
      title: '',
      description: ''
    })
  }
}
