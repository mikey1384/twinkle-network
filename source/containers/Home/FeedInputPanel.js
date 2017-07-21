import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import Textarea from 'react-textarea-autosize'
import Button from 'components/Button'
import {uploadContentAsync} from 'redux/actions/FeedActions'
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions'
import Link from 'components/Link'
import Input from 'components/Texts/Input'
import {
  isValidUrl,
  isValidYoutubeUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'

class FeedInputPanel extends Component {
  static propTypes = {
    loadVideoPage: PropTypes.func.isRequired,
    uploadContent: PropTypes.func.isRequired,
    username: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      descriptionFieldsShown: false,
      form: {
        url: '',
        checkedVideo: false,
        title: '',
        description: ''
      },
      urlError: null
    }

    this.onUrlFieldChange = this.onUrlFieldChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {username, loadVideoPage} = this.props
    const {
      form, urlError, descriptionFieldsShown
    } = this.state
    const {url, title} = form
    return (
      <div className="panel panel-default"
        style={{
          borderTop: '1px solid rgb(231, 231, 231)'
        }}
      >
        <div className="panel-heading flexbox-container">
          <p className="panel-title pull-left" style={{fontWeight: 'bold'}}>Hello{username ? ` ${username}!` : '!'} Got anything interesting you want to share?</p>
        </div>
        <div className="panel-body">
          <form className="container-fluid">
            <fieldset className="form-group" style={{marginBottom: '0.5em'}}>
              <label style={{paddingBottom: '0.3em'}}>
                <p style={{marginBottom: '0px'}}>
                  <strong>Copy the URL Address of a Website or a YouTube Video and Paste It Below</strong>
                </p>
                <p style={{marginBottom: '0px'}}>
                  <Link
                    to="/videos/1857"
                    onClickAsync={() => loadVideoPage(1857)}
                  >
                    Click here to learn how
                  </Link>
                </p>
              </label>
              <div style={{display: 'inline'}}>
                <Input
                  ref={ref => { this.UrlField = ref }}
                  style={{borderColor: !!urlError && 'red'}}
                  value={form.url}
                  onChange={this.onUrlFieldChange}
                  className="form-control"
                  placeholder="Enter url. For example: www.google.com"
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
              <label>YouTube Video:&nbsp;&nbsp;&nbsp;</label>
              <input
                onClick={() => {
                  this.setState({
                    form: {
                      ...form,
                      checkedVideo: !form.checkedVideo
                    },
                    urlError: null
                  })
                }}
                checked={form.checkedVideo}
                type="checkbox"
              />
            </fieldset>
            {descriptionFieldsShown &&
              <div>
                <fieldset className="form-group">
                  <div style={{display: 'inline'}}>
                    <Input
                      value={form.title}
                      onChange={text => this.setState({form: {...form, title: text}})}
                      className="form-control"
                      placeholder="Enter Title"
                      onKeyUp={event => {
                        if (event.key === ' ') {
                          this.setState({
                            form: {
                              ...this.state.form,
                              title: addEmoji(event.target.value)
                            }
                          })
                        }
                      }}
                      type="text"
                    />
                  </div>
                </fieldset>
                <fieldset className="form-group">
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
                            ...this.state.form,
                            description: addEmoji(event.target.value)
                          }
                        })
                      }
                    }}
                  />
                </fieldset>
              </div>
            }
            <Button
              className="btn btn-primary"
              type="submit"
              disabled={stringIsEmpty(url) || stringIsEmpty(title)}
              onClick={this.onSubmit}
            >
              Share!
            </Button>
          </form>
        </div>
      </div>
    )
  }

  onSubmit(event) {
    const {uploadContent} = this.props
    const {form} = this.state
    const {url, checkedVideo} = form
    let urlError
    event.preventDefault()

    if (!isValidUrl(url)) urlError = 'That is not a valid url'
    if (checkedVideo && !isValidYoutubeUrl(url)) urlError = 'That is not a valid YouTube url'

    if (urlError) {
      this.setState({urlError})
      return this.UrlField.focus()
    }

    this.setState({
      descriptionFieldsShown: false,
      form: {
        url: '',
        checkedVideo: false,
        title: '',
        description: ''
      },
      urlError: null
    })
    window.scrollTo(0, 0)
    uploadContent({
      ...form,
      title: finalizeEmoji(form.title),
      description: finalizeEmoji(form.description)
    })
  }

  onUrlFieldChange(url) {
    const {form} = this.state
    this.setState({
      form: {...form, url, checkedVideo: isValidYoutubeUrl(url) || form.checkedVideo},
      urlError: null,
      descriptionFieldsShown: true
    })
  }
}

export default connect(
  state => ({
    username: state.UserReducer.username
  }),
  {
    loadVideoPage: loadVideoPageFromClientSideAsync,
    uploadContent: uploadContentAsync
  }
)(FeedInputPanel)
