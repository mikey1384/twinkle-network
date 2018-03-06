import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Button from 'components/Button'
import { timeSince } from 'helpers/timeStampHelpers'
import UsernameText from 'components/Texts/UsernameText'
import PanelComments from 'components/PanelComments'
import DropdownButton from 'components/DropdownButton'
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
  deleteVideoCommentAsync,
  editVideoCommentAsync,
  loadVideoDiscussionComments,
  loadMoreDiscussionComments,
  uploadVideoDiscussionComment,
  uploadVideoDiscussionReply,
  likeVideoComment,
  loadMoreReplies,
  editVideoDiscussion,
  deleteVideoDiscussion
} from 'redux/actions/VideoActions'
import { css } from 'emotion'

class DiscussionPanel extends Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    description: PropTypes.string,
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
    onReplySubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string.isRequired,
    videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired
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
    this.onDelete = this.onDelete.bind(this)
    this.onEditDone = this.onEditDone.bind(this)
    this.onExpand = this.onExpand.bind(this)
    this.onCommentSubmit = this.onCommentSubmit.bind(this)
    this.onReplySubmit = this.onReplySubmit.bind(this)
    this.loadMoreComments = this.loadMoreComments.bind(this)
  }

  render() {
    const {
      id,
      title,
      description,
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
      onLoadMoreReplies
    } = this.props
    const {
      expanded,
      onEdit,
      confirmModalShown,
      editedTitle,
      editedDescription,
      editDoneButtonDisabled
    } = this.state
    const userIsOwner = myId === userId
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
                font-weight: bold;
              }
            `}
          >
            {!onEdit && <p>{cleanString(title)}</p>}
            {userIsOwner &&
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
                <PanelComments
                  autoFocus
                  inputTypeLabel={'answer'}
                  type="videoDiscussionPanel"
                  comments={comments}
                  loadMoreButton={loadMoreDiscussionCommentsButton}
                  userId={myId}
                  onSubmit={this.onCommentSubmit}
                  contentId={id}
                  loadMoreComments={this.loadMoreComments}
                  parent={{ type: 'discussion', id }}
                  commentActions={{
                    onDelete,
                    onLikeClick,
                    onEditDone,
                    onReplySubmit: this.onReplySubmit,
                    onLoadMoreReplies
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
                    transparent
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
                name: username,
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

  determineEditButtonDoneStatus() {
    const { editedTitle, editedDescription } = this.state
    const { title, description } = this.props
    const titleIsEmpty = stringIsEmpty(editedTitle)
    const titleChanged = editedTitle !== title
    const descriptionChanged = editedDescription !== description
    const editDoneButtonDisabled =
      titleIsEmpty || (!titleChanged && !descriptionChanged)
    this.setState({ editDoneButtonDisabled })
  }

  loadMoreComments({ lastCommentId }) {
    const { id, loadMoreComments } = this.props
    loadMoreComments({ lastCommentId, discussionId: id })
  }

  onCommentSubmit(comment) {
    const { onSubmit, videoId, id, title } = this.props
    onSubmit({ comment, videoId, discussionId: id, discussionTitle: title })
  }

  onDelete() {
    const { id, onDiscussionDelete } = this.props
    onDiscussionDelete(id, () => {
      this.setState({ confirmModalShown: false })
    })
  }

  onExpand() {
    const { loadComments, id } = this.props
    this.setState({ expanded: true })
    loadComments(id)
  }

  onEditDone() {
    const { editedTitle, editedDescription } = this.state
    const { id, onDiscussionEditDone } = this.props
    onDiscussionEditDone(
      id,
      finalizeEmoji(editedTitle),
      finalizeEmoji(editedDescription),
      () => {
        this.setState({
          onEdit: false,
          editDoneButtonDisabled: true
        })
      }
    )
  }

  onReplySubmit({ replyContent, comment, replyOfReply, originType }) {
    const { onReplySubmit, videoId, id } = this.props
    onReplySubmit({
      discussionId: id,
      replyContent,
      comment,
      videoId,
      replyOfReply,
      originType
    })
  }
}

export default connect(
  state => ({
    myId: state.UserReducer.userId
  }),
  {
    onDelete: deleteVideoCommentAsync,
    onEditDone: editVideoCommentAsync,
    loadComments: loadVideoDiscussionComments,
    loadMoreComments: loadMoreDiscussionComments,
    onSubmit: uploadVideoDiscussionComment,
    onLikeClick: likeVideoComment,
    onReplySubmit: uploadVideoDiscussionReply,
    onLoadMoreReplies: loadMoreReplies,
    onDiscussionEditDone: editVideoDiscussion,
    onDiscussionDelete: deleteVideoDiscussion
  }
)(DiscussionPanel)
