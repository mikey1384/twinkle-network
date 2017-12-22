import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import Input from 'components/Texts/Input'
import Button from 'components/Button'
import { edit } from 'constants/placeholders'
import { connect } from 'react-redux'
import { feedContentEdit } from 'redux/actions/FeedActions'
import {
  addEmoji,
  finalizeEmoji,
  stringIsEmpty,
  turnStringIntoQuestion,
  isValidUrl,
  isValidYoutubeUrl
} from 'helpers/stringHelpers'

class ContentEditor extends Component {
  static propTypes = {
    comment: PropTypes.string,
    content: PropTypes.string,
    contentId: PropTypes.number.isRequired,
    description: PropTypes.string,
    onDismiss: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    style: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string.isRequired
  }

  constructor({ comment, description, title, type, content }) {
    super()
    this.state = {
      buttonDisabled: false,
      editedContent: content || '',
      editedComment: comment || '',
      editedDescription: description || '',
      editedTitle: title || '',
      editedUrl:
        type === 'video'
          ? `https://www.youtube.com/watch?v=${content}`
          : content
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const { onDismiss, style, type } = this.props
    const {
      buttonDisabled,
      editedComment,
      editedContent,
      editedDescription,
      editedTitle,
      editedUrl
    } = this.state
    return (
      <div style={style}>
        <form onSubmit={this.onSubmit}>
          {(type === 'video' || type === 'url') && (
            <fieldset className="form-group">
              <Input
                autoFocus
                className="form-control"
                onChange={text => {
                  const buttonDisabled =
                    (type === 'video' && !isValidYoutubeUrl(text)) ||
                    (type === 'url' && !isValidUrl(text))
                  this.setState({
                    editedUrl: text,
                    buttonDisabled
                  })
                }}
                placeholder={edit[type]}
                value={editedUrl}
              />
            </fieldset>
          )}
          {type !== 'comment' &&
            type !== 'question' && (
              <fieldset className="form-group">
                <Input
                  autoFocus={type === 'discussion'}
                  className="form-control"
                  onChange={text => this.setState({ editedTitle: text })}
                  onKeyUp={event =>
                    this.setState({
                      editedTitle: addEmoji(event.target.value),
                      buttonDisabled: stringIsEmpty(event.target.value)
                    })
                  }
                  placeholder={edit.title}
                  value={editedTitle}
                />
              </fieldset>
            )}
          {type !== 'question' && (
            <fieldset className="form-group">
              <Textarea
                autoFocus={type === 'comment'}
                className="form-control"
                minRows={4}
                onChange={event =>
                  this.setState({
                    [type === 'comment' ? 'editedComment' : 'editedDescription']: event.target.value,
                    buttonDisabled: stringIsEmpty(event.target.value)
                  })
                }
                placeholder={
                  edit[type === 'comment' ? 'comment' : 'description']
                }
                value={type === 'comment' ? editedComment : editedDescription}
              />
            </fieldset>
          )}
          {type === 'question' && (
            <fieldset className="form-group">
              <Input
                className="form-control"
                placeholder={edit['question']}
                value={editedContent}
                onChange={text => {
                  this.setState(() => ({
                    editedContent: text,
                    buttonDisabled: text.length > 100 || stringIsEmpty(text)
                  }))
                }}
                style={{ marginBottom: '0.3em' }}
              />
              <small
                style={{ color: editedContent.length > 100 ? 'red' : null }}
              >
                {editedContent.length}/100 Characters
              </small>
            </fieldset>
          )}
          <fieldset>
            <Button
              className="btn btn-primary"
              type="submit"
              disabled={buttonDisabled}
            >
              Done
            </Button>
            <Button
              className="btn btn-default"
              style={{ marginLeft: '0.5em' }}
              type="button"
              onClick={onDismiss}
            >
              Cancel
            </Button>
          </fieldset>
        </form>
      </div>
    )
  }

  onSubmit(event) {
    event.preventDefault()
    const { contentId, onDismiss, onSubmit, type } = this.props
    const {
      editedComment,
      editedContent,
      editedDescription,
      editedTitle
    } = this.state
    const post = {
      ...this.state,
      editedComment: finalizeEmoji(editedComment),
      editedContent: turnStringIntoQuestion(finalizeEmoji(editedContent)),
      editedDescription: finalizeEmoji(editedDescription),
      editedTitle: finalizeEmoji(editedTitle)
    }
    onSubmit({ ...post, contentId, type }).then(() => onDismiss())
  }
}

export default connect(null, { onSubmit: feedContentEdit })(ContentEditor)
