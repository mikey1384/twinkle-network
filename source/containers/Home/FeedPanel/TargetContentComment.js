import React, {Component, PropTypes} from 'react'
import SmallDropdownButton from 'components/SmallDropdownButton'
import ProfilePic from 'components/ProfilePic'
import UsernameText from 'components/UsernameText'
import EditTextArea from 'components/EditTextArea'
import ConfirmModal from 'components/Modals/ConfirmModal'
import {timeSince} from 'helpers/timeStampHelpers'
import {cleanStringWithURL} from 'helpers/stringHelpers'

export default class TargetContentComment extends Component {
  static propTypes = {
    comment: PropTypes.object,
    username: PropTypes.string,
    userId: PropTypes.number,
    profilePicId: PropTypes.number,
    onDelete: PropTypes.func,
    onEditDone: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      onEdit: false,
      confirmModalShown: false
    }
    this.onDelete = this.onDelete.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
  }

  render() {
    const {comment, username, userId, profilePicId} = this.props
    const {onEdit, confirmModalShown} = this.state
    return (
      <li
        className="media"
        style={{marginTop: '0px'}}
      >
        {!onEdit &&
          <div className="row">
            <SmallDropdownButton
              shape="button"
              icon="pencil"
              style={{
                position: 'absolute',
                right: '7%',
                opacity: 0.7
              }}
              menuProps={[
                {
                  label: 'Edit',
                  onClick: () => this.setState({onEdit: true})
                },
                {
                  label: 'Remove',
                  onClick: () => this.setState({confirmModalShown: true})
                }
              ]}
            />
          </div>
        }
        <ProfilePic size="3.5" userId={userId} profilePicId={profilePicId} />
        <div className="media-body">
          <h5 className="media-heading">
            <UsernameText user={{
              name: username,
              id: userId
            }} /> <small>&nbsp;{timeSince(comment.timeStamp)}</small>
          </h5>
          {onEdit ?
            <EditTextArea
              autoFocus
              text={cleanStringWithURL(comment.content)}
              onCancel={() => this.setState({onEdit: false})}
              onEditDone={this.onEditDone}
            /> :
            <div className="container-fluid">
              <div
                className="row"
                style={{paddingBottom: '1.3em'}}
                dangerouslySetInnerHTML={{__html: comment.content}}
              ></div>
            </div>
          }
        </div>
        {confirmModalShown &&
          <ConfirmModal
            onHide={() => this.setState({confirmModalShown: false})}
            title="Remove Comment"
            onConfirm={this.onDelete}
          />
        }
      </li>
    )
  }

  onDelete() {
    const {comment, onDelete} = this.props
    onDelete(comment.id)
  }

  onEditDone(editedComment) {
    const {comment, onEditDone} = this.props
    onEditDone({editedComment, commentId: comment.id}, () => {
      this.setState({onEdit: false})
    })
  }
}
