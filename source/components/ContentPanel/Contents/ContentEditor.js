import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'components/Texts/Textarea'
import Input from 'components/Texts/Input'
import Button from 'components/Button'
import { edit } from 'constants/placeholders'
import {
  addEmoji,
  finalizeEmoji,
  stringIsEmpty,
  turnStringIntoQuestion,
  isValidUrl,
  isValidYoutubeUrl
} from 'helpers/stringHelpers'

export default class ContentEditor extends Component {
  static propTypes = {
    comment: PropTypes.string,
    content: PropTypes.string,
    contentId: PropTypes.number.isRequired,
    description: PropTypes.string,
    onDismiss: PropTypes.func.isRequired,
    onEditContent: PropTypes.func.isRequired,
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
            <Input
              autoFocus
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
          )}
          {type !== 'comment' &&
            type !== 'question' && (
              <Input
                style={{ marginTop: '1rem' }}
                autoFocus={type === 'discussion'}
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
            )}
          {type === 'question' && (
            <Fragment>
              <Input
                style={{ marginTop: '1rem' }}
                placeholder={edit['question']}
                value={editedContent}
                onChange={text => {
                  this.setState(() => ({
                    editedContent: text,
                    buttonDisabled: text.length > 100 || stringIsEmpty(text)
                  }))
                }}
              />
              <small
                style={{ color: editedContent.length > 100 ? 'red' : null }}
              >
                {editedContent.length}/100 Characters
              </small>
            </Fragment>
          )}
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <Textarea
              autoFocus={type === 'comment'}
              minRows={4}
              onChange={event => {
                const { value } = event.target
                this.setState(state => ({
                  [type === 'comment' ? 'editedComment' : 'editedDescription']: value,
                  buttonDisabled:
                    type === 'comment'
                      ? stringIsEmpty(value)
                      : state.buttonDisabled
                }))
              }}
              placeholder={edit[type === 'comment' ? 'comment' : 'description']}
              value={type === 'comment' ? editedComment : editedDescription}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button primary type="submit" disabled={buttonDisabled}>
              Done
            </Button>
            <Button
              style={{ marginLeft: '0.5em' }}
              type="button"
              onClick={onDismiss}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    )
  }

  onSubmit(event) {
    event.preventDefault()
    const { contentId, onDismiss, onEditContent, type } = this.props
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
    onEditContent({ ...post, contentId, type }).then(() => onDismiss())
  }
}
