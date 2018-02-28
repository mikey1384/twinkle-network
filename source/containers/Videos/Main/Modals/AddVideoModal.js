import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Textarea from 'components/Texts/Textarea'
import Modal from 'components/Modal'
import Button from 'components/Button'
import { uploadVideoAsync } from 'redux/actions/VideoActions'
import { connect } from 'react-redux'
import Input from 'components/Texts/Input'
import {
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'

class AddVideoModal extends Component {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    uploadVideo: PropTypes.func.isRequired
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
        <div className="modal-heading">Add Videos</div>
        <div className="modal-body">
          <form style={{ width: '100%' }}>
            <section>
              <Input
                ref={ref => {
                  this.UrlField = ref
                }}
                style={{ borderColor: !!urlError && 'red' }}
                value={form.url}
                onChange={this.onUrlFieldChange}
                className="form-control"
                placeholder="Paste video's YouTube url here"
                type="text"
              />
              {urlError && (
                <span
                  style={{
                    color: 'red',
                    lineHeight: '3rem',
                    marginBottom: '0px'
                  }}
                >
                  {urlError}
                </span>
              )}
            </section>
            <section style={{ marginTop: '1rem' }}>
              <div style={{ display: 'inline' }}>
                <Input
                  value={form.title}
                  onChange={text =>
                    this.setState({ form: { ...form, title: text } })
                  }
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
            </section>
            <section style={{ marginTop: '1rem', position: 'relative' }}>
              <Textarea
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
            </section>
          </form>
        </div>
        <div className="modal-footer">
          <Button
            primary
            type="submit"
            onClick={this.onSubmit}
            disabled={!url || !title || stringIsEmpty(title)}
          >
            Add
          </Button>
        </div>
      </Modal>
    )
  }

  onSubmit(event) {
    const { uploadVideo } = this.props
    const { form: { url, title, description } } = this.state

    event.preventDefault()
    if (!isValidYoutubeUrl(url)) {
      this.setState({ urlError: 'That is not a valid YouTube url' })
      return this.UrlField._rootDOMNode.focus()
    }

    uploadVideo({
      url,
      title: finalizeEmoji(title),
      description: finalizeEmoji(description)
    })
  }

  onUrlFieldChange(text) {
    const { form } = this.state
    this.setState({
      form: { ...form, url: text },
      urlError: null
    })
  }
}

export default connect(null, { uploadVideo: uploadVideoAsync })(AddVideoModal)
