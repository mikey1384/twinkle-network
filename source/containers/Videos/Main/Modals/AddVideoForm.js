import PropTypes from 'prop-types'
import React, {Component} from 'react'
import Textarea from 'react-textarea-autosize'
import {Modal} from 'react-bootstrap'
import Button from 'components/Button'
import {uploadVideoAsync} from 'redux/actions/VideoActions'
import {connect} from 'react-redux'
import Input from 'components/Texts/Input'
import {isValidYoutubeUrl, stringIsEmpty, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'

@connect(
  null,
  {
    uploadVideo: uploadVideoAsync
  }
)
export default class AddVideoForm extends Component {
  static propTypes = {
    uploadVideo: PropTypes.func
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
    const {urlError, form} = this.state
    const {url, title} = form
    return (
      <form className="container-fluid">
        <fieldset className="form-group" style={{marginBottom: '0.5em'}}>
          <label><b>YouTube Url</b></label>
          <div style={{display: 'inline'}}>
            <Input
              ref={ref => { this.UrlField = ref }}
              style={{borderColor: !!urlError && 'red'}}
              value={form.url}
              onChange={this.onUrlFieldChange}
              className="form-control"
              placeholder="Paste video's YouTube url here"
              type="text"
            />
          </div>
          {urlError &&
            <span
              className="help-block"
              style={{
                color: 'red',
                marginBottom: '0px'
              }}
            >
              {urlError}
            </span>
          }
        </fieldset>
        <fieldset className="form-group">
          <label><b>Title</b></label>
          <div style={{display: 'inline'}}>
            <Input
              value={form.title}
              onChange={text => this.setState({form: {...form, title: text}})}
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
          <label><strong>Description</strong></label>
          <Textarea
            value={form.description}
            className="form-control"
            minRows={4}
            placeholder="Enter Description (Optional, you don't need to write this)"
            onChange={event => this.setState({form: {...form, description: event.target.value}})}
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
      </form>
    )
  }

  onSubmit(event) {
    const {uploadVideo} = this.props
    const {form} = this.state
    const {url} = form
    let urlError
    event.preventDefault()

    if (!isValidYoutubeUrl(url)) urlError = 'That is not a valid YouTube url'
    if (urlError) {
      this.setState({urlError})
      return this.UrlField.focus()
    }

    uploadVideo({
      ...form,
      title: finalizeEmoji(form.title),
      description: finalizeEmoji(form.description)
    })
  }

  onUrlFieldChange(url) {
    const {form} = this.state
    this.setState({
      form: {...form, url, urlError: null},
      urlError: null
    })
  }
}
