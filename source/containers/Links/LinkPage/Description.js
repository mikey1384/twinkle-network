import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UsernameText from 'components/Texts/UsernameText'
import DropdownButton from 'components/DropdownButton'
import { timeSince } from 'helpers/timeStampHelpers'
import LongText from 'components/Texts/LongText'
import Button from 'components/Button'
import Textarea from 'components/Texts/Textarea'
import Input from 'components/Texts/Input'
import {
  cleanString,
  isValidUrl,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'

export default class Description extends Component {
  static propTypes = {
    description: PropTypes.string,
    linkId: PropTypes.number.isRequired,
    myId: PropTypes.number,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    uploaderId: PropTypes.number,
    uploaderName: PropTypes.string,
    url: PropTypes.string.isRequired
  }

  state = {
    onEdit: false,
    editDoneButtonDisabled: true
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      editedTitle: cleanString(nextProps.title),
      editedUrl: nextProps.content,
      editedDescription: nextProps.description
    }
  }

  render() {
    const {
      uploaderId,
      myId,
      title,
      description,
      uploaderName,
      timeStamp,
      onDelete
    } = this.props
    const {
      onEdit,
      editedTitle,
      editedDescription,
      editDoneButtonDisabled,
      editedUrl
    } = this.state
    return (
      <div style={{ position: 'relative', padding: '2rem 1rem 0 1rem' }}>
        {uploaderId === myId &&
          !onEdit && (
            <DropdownButton
              snow
              opacity={0.8}
              icon="pencil"
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              direction="left"
              menuProps={[
                {
                  label: 'Edit',
                  onClick: () => this.setState({ onEdit: true })
                },
                {
                  label: 'Delete',
                  onClick: onDelete
                }
              ]}
            />
          )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {onEdit ? (
              <Input
                type="text"
                style={{ width: '80%' }}
                placeholder="Enter Title..."
                value={editedTitle}
                onChange={text => {
                  this.setState({ editedTitle: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedTitle: addEmoji(event.target.value)
                    })
                  }
                }}
              />
            ) : (
              <h2>{title}</h2>
            )}
          </div>
          <div>
            <small>
              Added by{' '}
              <UsernameText user={{ id: uploaderId, name: uploaderName }} /> ({timeSince(
                timeStamp
              )})
            </small>
          </div>
        </div>
        <div
          style={{
            marginTop: '3rem',
            wordBreak: 'break-word'
          }}
        >
          {onEdit ? (
            <div>
              <Input
                placeholder="Enter URL"
                style={{ marginBottom: '1em' }}
                value={editedUrl}
                onChange={text => {
                  this.setState({ editedUrl: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
              />
              <Textarea
                minRows={4}
                placeholder="Enter Description"
                value={editedDescription}
                onChange={event => {
                  this.determineEditButtonDoneStatus()
                  this.setState(
                    { editedDescription: event.target.value },
                    () => {
                      this.determineEditButtonDoneStatus()
                    }
                  )
                }}
                onKeyUp={event => {
                  if (event.key === ' ') {
                    this.setState({
                      editedDescription: addEmoji(event.target.value)
                    })
                  }
                }}
              />
              <div style={{ justifyContent: 'center', display: 'flex' }}>
                <Button
                  transparent
                  style={{ marginRight: '5px' }}
                  onClick={this.onEditCancel}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  disabled={editDoneButtonDisabled}
                  onClick={this.onEditFinish}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <LongText lines={20}>{description || ''}</LongText>
          )}
        </div>
      </div>
    )
  }

  determineEditButtonDoneStatus = () => {
    const urlIsEmpty = stringIsEmpty(this.state.editedUrl)
    const urlIsValid = isValidUrl(this.state.editedUrl)
    const titleIsEmpty = stringIsEmpty(this.state.editedTitle)
    const titleChanged = this.state.editedTitle !== this.props.title
    const urlChanged = this.state.editedUrl !== this.props.url
    const descriptionChanged =
      this.state.editedDescription !== this.props.description
    const editDoneButtonDisabled =
      !urlIsValid ||
      urlIsEmpty ||
      titleIsEmpty ||
      (!titleChanged && !descriptionChanged && !urlChanged)
    this.setState({ editDoneButtonDisabled })
  }

  onEditCancel = () => {
    const { description, title, url } = this.props
    this.setState({
      editedUrl: url,
      editedTitle: cleanString(title),
      editedDescription: description,
      onEdit: false,
      editDoneButtonDisabled: true
    })
  }

  onEditFinish = () => {
    const { onEditDone, linkId } = this.props
    const { editedTitle, editedDescription, editedUrl } = this.state
    return onEditDone({
      editedUrl,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      linkId
    }).then(() => this.setState({ onEdit: false }))
  }
}
