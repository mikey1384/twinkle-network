import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import { Modal } from 'react-bootstrap'
import Button from 'components/Button'
import { uploadLink } from 'redux/actions/LinkActions'
import { connect } from 'react-redux'
import Input from 'components/Texts/Input'
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
      <Modal show onHide={onHide} animation={false}>
        <Modal.Header closeButton>
          <h4>Add Links</h4>
        </Modal.Header>
        <Modal.Body>
          <form className="container-fluid">
            <fieldset className="form-group" style={{ marginBottom: '0.5em' }}>
              <label>
                <b>Link URL</b>
              </label>
              <div style={{ display: 'inline' }}>
                <Input
                  ref={ref => {
                    this.UrlField = ref
                  }}
                  style={{ borderColor: !!urlError && 'red' }}
                  value={form.url}
                  onChange={this.onUrlFieldChange}
                  className="form-control"
                  placeholder="Paste the Link's Internet Address (URL) here"
                  type="text"
                />
              </div>
              {urlError && (
                <span
                  className="help-block"
                  style={{
                    color: 'red',
                    marginBottom: '0px'
                  }}
                >
                  {urlError}
                </span>
              )}
            </fieldset>
            <fieldset className="form-group">
              <label>
                <b>Title</b>
              </label>
              <div style={{ display: 'inline' }}>
                <Input
                  value={form.title}
                  onChange={text =>
                    this.setState({ form: { ...form, title: text } })
                  }
                  className="form-control"
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
              </div>
            </fieldset>
            <fieldset className="form-group">
              <label>
                <strong>Description</strong>
              </label>
              <Textarea
                value={form.description}
                className="form-control"
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
            </fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-primary"
            type="submit"
            onClick={this.onSubmit}
            disabled={!url || !title || stringIsEmpty(title)}
          >
            Add
          </Button>
        </Modal.Footer>
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
