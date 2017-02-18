import React, {Component, PropTypes} from 'react'
import Button from 'components/Button'
import {timeSince} from 'helpers/timeStampHelpers'
import UsernameText from 'components/Texts/UsernameText'
import PanelComments from 'components/PanelComments'
import SmallDropdownButton from 'components/SmallDropdownButton'
import {connect} from 'react-redux'
import {cleanString, cleanStringWithURL, stringIsEmpty} from 'helpers/stringHelpers'
import Textarea from 'react-textarea-autosize'
import LongText from 'components/Texts/LongText'
import ConfirmModal from 'components/Modals/ConfirmModal'
import {
  deleteVideoCommentAsync,
  editVideoCommentAsync,
  loadVideoDebateComments,
  loadMoreDebateComments,
  uploadVideoDebateComment,
  uploadVideoDebateReply,
  likeVideoComment,
  loadMoreReplies,
  editVideoDebate,
  deleteVideoDebate
} from 'redux/actions/VideoActions'

@connect(
  state => ({
    myId: state.UserReducer.userId
  }),
  {
    onDelete: deleteVideoCommentAsync,
    onEditDone: editVideoCommentAsync,
    loadComments: loadVideoDebateComments,
    loadMoreComments: loadMoreDebateComments,
    onSubmit: uploadVideoDebateComment,
    onLikeClick: likeVideoComment,
    onReplySubmit: uploadVideoDebateReply,
    onLoadMoreReplies: loadMoreReplies,
    onDebateEditDone: editVideoDebate,
    onDebateDelete: deleteVideoDebate
  }
)
export default class DebatePanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number,
    username: PropTypes.string,
    userId: PropTypes.number,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    numComments: PropTypes.string,
    myId: PropTypes.number,
    comments: PropTypes.array,
    loadMoreDebateCommentsButton: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onDelete: PropTypes.func,
    onEditDone: PropTypes.func,
    onLoadMoreReplies: PropTypes.func,
    loadMoreComments: PropTypes.func,
    videoId: PropTypes.number,
    onSubmit: PropTypes.func,
    onDebateDelete: PropTypes.func,
    loadComments: PropTypes.func,
    onReplySubmit: PropTypes.func,
    onDebateEditDone: PropTypes.func
  }

  constructor(props) {
    super()
    this.state = {
      expanded: false,
      onEdit: false,
      confirmModalShown: false,
      editedTitle: cleanString(props.title),
      editedDescription: cleanStringWithURL(props.description),
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
      id, title, description, username, userId, timeStamp, numComments, myId,
      comments, loadMoreDebateCommentsButton, onLikeClick, onDelete, onEditDone, onLoadMoreReplies
    } = this.props
    const {expanded, onEdit, confirmModalShown, editedTitle, editedDescription, editDoneButtonDisabled} = this.state
    const userIsOwner = myId === userId
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <div className="panel-body">
          {userIsOwner && !onEdit &&
            <SmallDropdownButton
              shape="button"
              icon="pencil"
              style={{
                float: 'right',
                position: 'relative'
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
          }
          {!onEdit &&
            <p style={{fontSize: '2rem'}}>{cleanString(title)}</p>
          }
          {!onEdit && expanded && !!description && (
            <LongText>{description}</LongText>
          )}
          {onEdit &&
            <form onSubmit={event => event.preventDefault()}>
              <input
                autoFocus
                ref="editTitleInput"
                type="text"
                className="form-control"
                placeholder="Enter Title..."
                value={editedTitle}
                onChange={event => {
                  this.setState({editedTitle: event.target.value}, () => {
                    this.determineEditButtonDoneStatus()
                  })
                }}
              />
            </form>
          }
          {onEdit &&
            <div>
              <Textarea
                placeholder="Enter Description (Optional)"
                className="form-control"
                style={{marginTop: '1em'}}
                rows={4}
                value={editedDescription}
                onChange={event => this.setState({editedDescription: event.target.value}, () => {
                  this.determineEditButtonDoneStatus()
                })}
              />
              <div style={{marginTop: '1em'}}>
                <Button
                  className="btn btn-default btn-sm"
                  onClick={this.onEditDone}
                  disabled={editDoneButtonDisabled}
                >
                  Done
                </Button>
                <Button
                  className="btn btn-default btn-sm"
                  style={{
                    marginLeft: '0.5em'
                  }}
                  onClick={() => this.setState({
                    onEdit: false,
                    editedTitle: cleanString(title),
                    editedDescription: cleanStringWithURL(description)
                  })}
                >
                  Cancel
                </Button>
              </div>
            </div>
          }
          {!onEdit &&
            <div>
              {expanded ?
                <PanelComments
                  autoFocus
                  inputTypeLabel={'comment'}
                  type="videoDiscussionPanel"
                  comments={comments}
                  loadMoreButton={loadMoreDebateCommentsButton}
                  userId={myId}
                  onSubmit={this.onCommentSubmit}
                  contentId={id}
                  loadMoreComments={this.loadMoreComments}
                  parent={{type: 'debate', id}}
                  commentActions={{
                    onDelete,
                    onLikeClick,
                    onEditDone,
                    onReplySubmit: this.onReplySubmit,
                    onLoadMoreReplies
                  }}
                /> :
                <Button
                  style={{marginTop: '0.5em'}}
                  className="btn btn-warning"
                  onClick={this.onExpand}
                >Answer{!!numComments && numComments > 0 ? ` (${numComments})` : ''}</Button>
              }
            </div>
          }
        </div>
        <div className="panel-footer">
          By <strong>
              <UsernameText user={{
                name: username,
                id: userId
              }} />
            </strong> &nbsp;|&nbsp; Published {timeSince(timeStamp)}
        </div>
        {confirmModalShown &&
          <ConfirmModal
            onHide={() => this.setState({confirmModalShown: false})}
            title="Remove Discussion"
            onConfirm={this.onDelete}
          />
        }
      </div>
    )
  }

  determineEditButtonDoneStatus() {
    const {editedTitle, editedDescription} = this.state
    const {title, description} = this.props
    const titleIsEmpty = stringIsEmpty(editedTitle)
    const titleChanged = editedTitle !== title
    const descriptionChanged = editedDescription !== cleanStringWithURL(description)
    const editDoneButtonDisabled = titleIsEmpty || (!titleChanged && !descriptionChanged)
    this.setState({editDoneButtonDisabled})
  }

  loadMoreComments(lastCommentId) {
    const {id, loadMoreComments} = this.props
    loadMoreComments(lastCommentId, id)
  }

  onCommentSubmit(comment) {
    const {onSubmit, videoId, id, title} = this.props
    onSubmit({comment, videoId, discussionId: id, discussionTitle: title})
  }

  onDelete() {
    const {id, onDebateDelete} = this.props
    onDebateDelete(id, () => {
      this.setState({confirmModalShown: false})
    })
  }

  onExpand() {
    const {loadComments, id} = this.props
    this.setState({expanded: true})
    loadComments(id)
  }

  onEditDone() {
    const {editedTitle, editedDescription} = this.state
    const {id, onDebateEditDone} = this.props
    onDebateEditDone(id, editedTitle, editedDescription, () => {
      this.setState({
        onEdit: false,
        editDoneButtonDisabled: true
      })
    })
  }

  onReplySubmit({replyContent, comment, replyOfReply, originType}) {
    const {onReplySubmit, videoId} = this.props
    onReplySubmit({replyContent, comment, videoId, replyOfReply, originType})
  }
}
