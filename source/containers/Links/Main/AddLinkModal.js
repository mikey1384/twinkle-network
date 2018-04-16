import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import Modal from 'components/Modal'
import Button from 'components/Button'
import { uploadLink } from 'redux/actions/LinkActions'
import { connect } from 'react-redux'
import Input from 'components/Texts/Input'
import Banner from 'components/Banner'
import { css } from 'emotion'
import {
  exceedsCharLimit,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  renderCharLimit
} from 'helpers/stringHelpers'

class AddLinkModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    uploadLink: PropTypes.func
  }

  state = {
    urlError: null,
    form: {
      url: '',
      title: '',
      description: ''
    }
  }

  render() {
    const { onHide } = this.props
    const { urlError, form } = this.state
    return (
      <Modal onHide={onHide}>
        <header>Add Links</header>
        <main>
          {urlError && (
            <Banner style={{ marginBottom: '1rem' }} love>
              {urlError}
            </Banner>
          )}
          <Input
            ref={ref => {
              this.UrlField = ref
            }}
            style={this.urlHasError()}
            value={form.url}
            onChange={this.onUrlFieldChange}
            placeholder="Paste the Link's Internet Address (URL) here"
            type="text"
          />
          <Input
            className={css`
              margin-top: 1rem;
            `}
            value={form.title}
            onChange={text => this.setState({ form: { ...form, title: text } })}
            placeholder="Enter Title"
            type="text"
            onKeyUp={event => {
              if (event.key === ' ') {
                this.setState({
                  form: {
                    ...form,
                    title: addEmoji(event.target.value)
                  }
                })
              }
            }}
            style={this.titleExceedsCharLimit()}
          />
          {this.titleExceedsCharLimit() && (
            <small style={{ color: 'red', width: '100%' }}>
              {renderCharLimit({
                contentType: 'url',
                inputType: 'title',
                text: form.title
              })}
            </small>
          )}
          <Textarea
            style={{
              marginTop: '1rem',
              ...(this.descriptionExceedsCharLimit() || {})
            }}
            value={form.description}
            minRows={4}
            placeholder="Enter Description (Optional, you don't need to write this)"
            onChange={event =>
              this.setState({
                form: { ...form, description: event.target.value }
              })
            }
            onKeyUp={event => {
              if (event.key === ' ') {
                this.setState({
                  form: {
                    ...form,
                    description: addEmoji(event.target.value)
                  }
                })
              }
            }}
          />
          {this.descriptionExceedsCharLimit() && (
            <small style={{ color: 'red', width: '100%' }}>
              {renderCharLimit({
                contentType: 'url',
                inputType: 'description',
                text: form.description
              })}
            </small>
          )}
        </main>
        <footer>
          <Button
            primary
            type="submit"
            onClick={this.onSubmit}
            disabled={this.submitDisabled()}
          >
            Add
          </Button>
          <Button onClick={onHide} transparent style={{ marginRight: '1rem' }}>
            Cancel
          </Button>
        </footer>
      </Modal>
    )
  }

  onSubmit = event => {
    const { uploadLink, onHide } = this.props
    const { form: { url, title, description } } = this.state

    event.preventDefault()
    if (!isValidUrl(url)) {
      this.setState({ urlError: 'That is not a valid url' })
      return this.UrlField._rootDOMNode.focus()
    }

    return uploadLink({
      url,
      title: finalizeEmoji(title),
      description: finalizeEmoji(description)
    }).then(() => onHide())
  }

  onUrlFieldChange = text => {
    const { form } = this.state
    this.setState({
      form: { ...form, url: text },
      urlError: null
    })
  }

  submitDisabled = () => {
    const { form: { url, title } } = this.state
    if (stringIsEmpty(url)) return true
    if (stringIsEmpty(title)) return true
    if (this.urlHasError()) return true
    if (this.titleExceedsCharLimit()) return true
    if (this.descriptionExceedsCharLimit()) return true
    return false
  }

  urlHasError = () => {
    if (this.state.urlError) {
      return {
        color: 'red',
        borderColor: 'red'
      }
    }
    return this.urlExceedsCharLimit()
  }

  descriptionExceedsCharLimit = () => {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'description',
      text: this.state.form.description
    })
  }

  titleExceedsCharLimit = () => {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'title',
      text: this.state.form.title
    })
  }

  urlExceedsCharLimit = () => {
    return exceedsCharLimit({
      contentType: 'url',
      inputType: 'url',
      text: this.state.form.url
    })
  }
}

export default connect(null, { uploadLink: uploadLink })(AddLinkModal)
