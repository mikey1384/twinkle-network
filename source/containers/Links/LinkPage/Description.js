import PropTypes from 'prop-types'
import React, {Component} from 'react'
import UsernameText from 'components/Texts/UsernameText'
import SmallDropdownButton from 'components/SmallDropdownButton'
import {timeSince} from 'helpers/timeStampHelpers'
import LongText from 'components/Texts/LongText'
import Button from 'components/Button'
import Textarea from 'react-textarea-autosize'
import {cleanString, cleanStringWithURL, stringIsEmpty, addEmoji, finalizeEmoji} from 'helpers/stringHelpers'

export default class Description extends Component {
  static propTypes = {
    linkId: PropTypes.number,
    uploaderId: PropTypes.number,
    myId: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    uploaderName: PropTypes.string,
    onDelete: PropTypes.func,
    onEditDone: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      editedTitle: cleanString(props.title),
      editedDescription: cleanStringWithURL(props.description),
      onEdit: false,
      editDoneButtonDisabled: true
    }
    this.determineEditButtonDoneStatus = this.determineEditButtonDoneStatus.bind(this)
    this.onEditCancel = this.onEditCancel.bind(this)
    this.onEditFinish = this.onEditFinish.bind(this)
  }
  render() {
    const {uploaderId, myId, title, description, uploaderName, timeStamp, onDelete} = this.props
    const {
      onEdit,
      editedTitle,
      editedDescription,
      editDoneButtonDisabled
    } = this.state
    return (
      <div>
        {uploaderId === myId && !onEdit &&
          <SmallDropdownButton
            style={{
              top: '1em',
              right: '1em',
              position: 'absolute'
            }}
            shape="button" icon="pencil"
            menuProps={[
              {
                label: 'Edit',
                onClick: () => this.setState({onEdit: true})
              },
              {
                label: 'Delete',
                onClick: () => onDelete()
              }
            ]}
          />
        }
        <div className="row page-header text-center" style={{marginTop: '2.5rem'}}>
          <div>
            {onEdit ?
              <form className="col-sm-6 col-sm-offset-3" onSubmit={event => event.preventDefault()}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Title..."
                  value={editedTitle}
                  onChange={event => {
                    this.setState({editedTitle: event.target.value}, () => {
                      this.determineEditButtonDoneStatus()
                    })
                  }}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({editedTitle: addEmoji(event.target.value)})
                    }
                  }}
                />
              </form> :
              <h2>{title}</h2>
            }
          </div>
          <div>
            <small className="col-xs-12" style={{paddingTop: onEdit && '1em'}}>
              Added by <UsernameText user={{id: uploaderId, name: uploaderName}} /> ({timeSince(timeStamp)})
            </small>
          </div>
        </div>
        <div
          style={{
            fontSize: '1.7rem',
            lineHeight: '3rem'
          }}
        >
          {onEdit ?
            <div>
              <form>
                <Textarea
                  minRows={4}
                  className="form-control"
                  placeholder="Enter Description"
                  value={editedDescription}
                  onChange={event => {
                    this.determineEditButtonDoneStatus()
                    this.setState({editedDescription: event.target.value}, () => {
                      this.determineEditButtonDoneStatus()
                    })
                  }}
                  onKeyUp={event => {
                    if (event.key === ' ') {
                      this.setState({editedDescription: addEmoji(event.target.value)})
                    }
                  }}
                 />
              </form>
              <div
                className="row container-fluid text-center"
                style={{
                  marginTop: '1em'
                }}
              >
                <Button
                  className="btn btn-default btn-sm"
                  disabled={editDoneButtonDisabled}
                  onClick={this.onEditFinish}
                >Done</Button>
                <Button
                  className="btn btn-default btn-sm"
                  style={{marginLeft: '5px'}}
                  onClick={this.onEditCancel}
                >Cancel</Button>
              </div>
            </div> :
            <LongText lines={20}>{description || ''}</LongText>
          }
        </div>
      </div>
    )
  }

  determineEditButtonDoneStatus() {
    const titleIsEmpty = stringIsEmpty(this.state.editedTitle)
    const titleChanged = this.state.editedTitle !== this.props.title
    const descriptionChanged = this.state.editedDescription !== cleanStringWithURL(this.props.description)
    const editDoneButtonDisabled = titleIsEmpty || (!titleChanged && !descriptionChanged)
    this.setState({editDoneButtonDisabled})
  }

  onEditCancel() {
    const {description, title} = this.props
    this.setState({
      editedTitle: cleanString(title),
      editedDescription: cleanStringWithURL(description),
      onEdit: false,
      editDoneButtonDisabled: true
    })
  }

  onEditFinish() {
    const {onEditDone, linkId} = this.props
    const {editedTitle, editedDescription} = this.state
    return onEditDone({
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      linkId
    }).then(
      () => this.setState({onEdit: false})
    )
  }
}
