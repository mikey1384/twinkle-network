import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'
import Input from 'components/Texts/Input'
import Button from 'components/Button'
import {edit} from 'constants/placeholders'
import {connect} from 'react-redux'
import {feedContentEdit} from 'redux/actions/FeedActions'
import {addEmoji, finalizeEmoji, cleanStringWithURL, turnStringIntoQuestion} from 'helpers/stringHelpers'

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

  constructor({comment, description, title, type, content}) {
    super()
    this.state = {
      editedContent: cleanStringWithURL(content),
      editedComment: cleanStringWithURL(comment),
      editedDescription: cleanStringWithURL(description || ''),
      editedTitle: title,
      editedUrl: type === 'video' ? `https://www.youtube.com/watch?v=${content}` : content
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {onDismiss, style, type} = this.props
    const {editedComment, editedContent, editedDescription, editedTitle, editedUrl} = this.state
    return (
      <div
        style={style}
      >
        <form onSubmit={this.onSubmit}>
          {(type === 'video' || type === 'url') &&
            <fieldset className="form-group">
              <Input
                autoFocus
                className="form-control"
                onChange={text => this.setState({editedUrl: text})}
                placeholder={edit[type]}
                value={editedUrl}
              />
            </fieldset>
          }
          {type !== 'comment' && type !== 'question' &&
            <fieldset className="form-group">
              <Input
                autoFocus={type === 'discussion'}
                className="form-control"
                onChange={text => this.setState({editedTitle: text})}
                onKeyUp={event => this.setState({editedTitle: addEmoji(event.target.value)})}
                placeholder={edit.title}
                value={editedTitle}
              />
            </fieldset>
          }
          {type !== 'question' &&
            <fieldset className="form-group">
              <Textarea
                autoFocus={type === 'comment'}
                className="form-control"
                minRows={4}
                onChange={event => this.setState({
                  [type === 'comment' ? 'editedComment' : 'editedDescription']: event.target.value
                })}
                placeholder={edit[type === 'comment' ? 'comment' : 'description']}
                value={type === 'comment' ? editedComment : editedDescription}
              />
            </fieldset>
          }
          {type === 'question' &&
            <fieldset className="form-group">
              <Textarea
                autoFocus
                className="form-control"
                minRows={4}
                onChange={event => this.setState({
                  editedContent: event.target.value
                })}
                placeholder={edit['question']}
                value={editedContent}
              />
            </fieldset>
          }
          <fieldset>
            <Button
              className="btn btn-primary"
              type="submit"
            >
              Done
            </Button>
            <Button
              className="btn btn-default"
              style={{marginLeft: '0.5em'}}
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
    const {contentId, onDismiss, onSubmit, type} = this.props
    const {editedComment, editedContent, editedDescription, editedTitle} = this.state
    const post = {
      ...this.state,
      editedComment: finalizeEmoji(editedComment),
      editedContent: turnStringIntoQuestion(finalizeEmoji(editedContent)),
      editedDescription: finalizeEmoji(editedDescription),
      editedTitle: finalizeEmoji(editedTitle)
    }
    onSubmit({...post, contentId, type}).then(
      () => onDismiss()
    )
  }
}

export default connect(
  null,
  {onSubmit: feedContentEdit}
)(ContentEditor)
