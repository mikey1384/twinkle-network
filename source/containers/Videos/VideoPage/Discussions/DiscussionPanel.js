import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import { timeSince } from 'helpers/timeStampHelpers'
import UsernameText from 'components/Texts/UsernameText'
import Comments from 'components/Comments'
import DropdownButton from 'components/Buttons/DropdownButton'
import { connect } from 'react-redux'
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers'
import Textarea from 'components/Texts/Textarea'
import LongText from 'components/Texts/LongText'
import ConfirmModal from 'components/Modals/ConfirmModal'
import Input from 'components/Texts/Input'
import {
  attachStar,
  deleteVideoComment,
  editRewardComment,
  editVideoComment,
  loadVideoDiscussionComments,
  loadMoreDiscussionComments,
  uploadComment,
  uploadVideoDiscussionReply,
  likeVideoComment,
  loadMoreDiscussionReplies,
  editVideoDiscussion,
  deleteVideoDiscussion,
  uploadReply
} from 'redux/actions/VideoActions'
import { Color } from 'constants/css'
import { css } from 'emotion'

class DiscussionPanel extends Component {
  static propTypes = {
    attachStar: PropTypes.func.isRequired,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    comments: PropTypes.array.isRequired,
    description: PropTypes.string,
    editRewardComment: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    loadComments: PropTypes.func.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    loadMoreDiscussionCommentsButton: PropTypes.bool.isRequired,
    myId: PropTypes.number,
    numComments: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    onDiscussionDelete: PropTypes.func.isRequired,
    onDiscussionEditDone: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string.isRequired,
    uploadComment: PropTypes.func.isRequired,
    uploaderAuthLevel: PropTypes.number.isRequired,
    uploadReply: PropTypes.func.isRequired,
    videoId: PropTypes.number.isRequired
  }

  constructor(props) {
    super()
    this.state = {
      expanded: false,
      onEdit: false,
      confirmModalShown: false,
      editedTitle: cleanString(props.title),
      editedDescription: props.description || '',
      editDoneButtonDisabled: true
    }
  }

  render() {
    const {
      attachStar,
      authLevel,
      canDelete,
      canEdit,
      id,
      title,
      description,
      editRewardComment,
      uploaderAuthLevel,
      username,
      userId,
      timeStamp,
      numComments,
      myId,
      comments,
      loadMoreDiscussionCommentsButton,
      onLikeClick,
      onDelete,
      onEditDone,
      onLoadMoreReplies,
      uploadComment,
      uploadReply,
      videoId
    } = this.props
    const {
      expanded,
      onEdit,
      confirmModalShown,
      editedTitle,
      editedDescription,
      editDoneButtonDisabled
    } = this.state
    const userIsUploader = myId === userId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel
    const editButtonEnabled = userIsUploader || userCanEditThis
    return (
      <div
        className={css`
          background: #fff;
          padding: 1rem;
          margin-top: 1rem;
          font-size: 1.5rem;
        `}
      >
        <div>
          <div
            className={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                font-size: 2.5rem;
                color: ${Color.green()};
                font-weight: bold;
              }
            `}
          >
            {!onEdit && <p>{cleanString(title)}</p>}
            {editButtonEnabled &&
              !onEdit && (
                <DropdownButton
                  snow
                  direction="left"
                  icon="pencil"
                  menuProps={[
                    {
                      label: 'Edit',
                      onClick: () => this.setState({ onEdit: true })
                    },
                    {
                      label: 'Remove',
                      onClick: () => this.setState({ confirmModalShown: true })
                    }
                  ]}
                />
              )}
          </div>
          {!onEdit &&
            description && (
              <LongText style={{ padding: '1rem 0' }}>{description}</LongText>
            )}
          {onEdit && (
            <form onSubmit={event => event.preventDefault()}>
              <Input
                autoFocus
                type="text"
                placeholder="Enter Title..."
                value={editedTitle}
                onChange={text => {
                  this.setState({ editedTitle: text }, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
                onKeyUp={event =>
                  this.setState({ editedTitle: addEmoji(event.target.value) })
                }
              />
            </form>
          )}
          {onEdit && (
            <div>
              <Textarea
                placeholder="Enter Description (Optional)"
                style={{ marginTop: '1rem' }}
                minRows={5}
                value={editedDescription}
                onChange={event =>
                  this.setState(
                    { editedDescription: event.target.value },
                    () => {
                      this.determineEditButtonDoneStatus()
                    }
                  )
                }
              />
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Button
                  transparent
                  style={{
                    fontSize: '1.7rem',
                    marginRight: '1rem'
                  }}
                  onClick={() =>
                    this.setState({
                      onEdit: false,
                      editedTitle: cleanString(title),
                      editedDescription: description
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  primary
                  style={{
                    fontSize: '1.8rem'
                  }}
                  onClick={this.onEditDone}
                  disabled={editDoneButtonDisabled}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
          {!onEdit && (
            <div style={{ marginTop: '1rem' }}>
              {expanded ? (
                <Comments
                  autoFocus
                  inputTypeLabel={'answer'}
                  type="videoDiscussionPanel"
                  comments={comments}
                  loadMoreButton={loadMoreDiscussionCommentsButton}
                  userId={myId}
                  onCommentSubmit={uploadComment}
                  onReplySubmit={uploadReply}
                  contentId={id}
                  loadMoreComments={this.loadMoreComments}
                  parent={{
                    type: 'discussion',
                    id,
                    rootObj: { type: 'video', id: videoId }
                  }}
                  commentActions={{
                    attachStar,
                    onDelete,
                    onLikeClick,
                    onEditDone,
                    onLoadMoreReplies,
                    onRewardCommentEdit: editRewardComment
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '8rem'
                  }}
                >
                  <Button
                    filled
                    success
                    style={{ fontSize: '2rem' }}
                    onClick={this.onExpand}
                  >
                    <span className="glyphicon glyphicon-comment" /> Answer{numComments &&
                    numComments > 0
                      ? ` (${numComments})`
                      : ''}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          By{' '}
          <strong>
            <UsernameText
              user={{
                username,
                id: userId
              }}
            />
          </strong>{' '}
          &nbsp;|&nbsp; Published {timeSince(timeStamp)}
        </div>
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Discussion"
            onConfirm={this.onDelete}
          />
        )}
      </div>
    )
  }

  determineEditButtonDoneStatus = () => {
    const { editedTitle, editedDescription } = this.state
    const { title, description } = this.props
    const titleIsEmpty = stringIsEmpty(editedTitle)
    const titleChanged = editedTitle !== title
    const descriptionChanged = editedDescription !== description
    const editDoneButtonDisabled =
      titleIsEmpty || (!titleChanged && !descriptionChanged)
    this.setState({ editDoneButtonDisabled })
  }

  loadMoreComments = ({ lastCommentId }) => {
    const { id, loadMoreComments } = this.props
    loadMoreComments({ lastCommentId, discussionId: id })
  }

  onDelete = () => {
    const { id, onDiscussionDelete } = this.props
    onDiscussionDelete(id, () => {
      this.setState({ confirmModalShown: false })
    })
  }

  onExpand = () => {
    const { loadComments, id } = this.props
    this.setState({ expanded: true })
    loadComments(id)
  }

  onEditDone = async() => {
    const { editedTitle, editedDescription } = this.state
    const { id, onDiscussionEditDone } = this.props
    await onDiscussionEditDone(
      id,
      finalizeEmoji(editedTitle),
      finalizeEmoji(editedDescription)
    )
    this.setState({
      onEdit: false,
      editDoneButtonDisabled: true
    })
  }
}

export default connect(
  state => ({
    myId: state.UserReducer.userId,
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit
  }),
  {
    attachStar,
    editRewardComment,
    onDelete: deleteVideoComment,
    onEditDone: editVideoComment,
    loadComments: loadVideoDiscussionComments,
    loadMoreComments: loadMoreDiscussionComments,
    onLikeClick: likeVideoComment,
    onReplySubmit: uploadVideoDiscussionReply,
    onLoadMoreReplies: loadMoreDiscussionReplies,
    onDiscussionEditDone: editVideoDiscussion,
    onDiscussionDelete: deleteVideoDiscussion,
    uploadComment,
    uploadReply
  }
)(DiscussionPanel)
