import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import Modal from 'components/Modal'
import Button from 'components/Button'
import { uploadLink } from 'redux/actions/LinkActions'
import { connect } from 'react-redux'
import Input from 'components/Texts/Input'
import Banner from 'components/Banner'
import {
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'

class AddLinkModal extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    uploadLink: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      urlError: null,
      form: {
        url: '',
        title: '',
        description: ''
      }
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onUrlFieldChange = this.onUrlFieldChange.bind(this)
  }

  render() {
    const { onHide } = this.props
    const { urlError, form } = this.state
    const { url, title } = form
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
            style={{ borderColor: !!urlError && 'red' }}
            value={form.url}
            onChange={this.onUrlFieldChange}
            placeholder="Paste the Link's Internet Address (URL) here"
            type="text"
          />
          <Input
            style={{ marginTop: '1rem' }}
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
          />
          <Textarea
            style={{ marginTop: '1rem' }}
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
        </main>
        <footer>
          <Button
            primary
            type="submit"
            onClick={this.onSubmit}
            disabled={!url || !title || stringIsEmpty(title)}
          >
            Add
          </Button>
        </footer>
      </Modal>
    )
  }

  onSubmit(event) {
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

  onUrlFieldChange(text) {
    const { form } = this.state
    this.setState({
      form: { ...form, url: text },
      urlError: null
    })
  }
}

export default connect(null, { uploadLink: uploadLink })(AddLinkModal)
