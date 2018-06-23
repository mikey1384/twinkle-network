import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { timeSince } from 'helpers/timeStampHelpers'
import DropdownButton from 'components/Buttons/DropdownButton'
import EditTextArea from 'components/Texts/EditTextArea'
import Likers from 'components/Likers'
import { Color } from 'constants/css'
import UserListModal from 'components/Modals/UserListModal'
import UsernameText from 'components/Texts/UsernameText'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import LikeButton from 'components/Buttons/LikeButton'
import ReplyInputArea from './ReplyInputArea'
import {
  determineXpButtonDisabled,
  scrollElementToCenter
} from 'helpers/domHelpers'
import ConfirmModal from 'components/Modals/ConfirmModal'
import LongText from 'components/Texts/LongText'
import RewardStatus from 'components/RewardStatus'
import { attachStar, editRewardComment } from 'redux/actions/VideoActions'
import XPRewardInterface from 'components/XPRewardInterface'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { css } from 'emotion'

class Reply extends Component {
  static propTypes = {
    attachStar: PropTypes.func,
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    canStar: PropTypes.bool,
    commentId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    editRewardComment: PropTypes.func.isRequired,
    forDiscussionPanel: PropTypes.bool,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    innerRef: PropTypes.func.isRequired,
    likes: PropTypes.array.isRequired,
    myId: PropTypes.number,
    replyOfReply: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onReplySubmit: PropTypes.func.isRequired,
    profilePicId: PropTypes.number,
    stars: PropTypes.array,
    targetUserId: PropTypes.number,
    targetUserName: PropTypes.string,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    uploaderAuthLevel: PropTypes.number,
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    videoId: PropTypes.number.isRequired
  }

  state = {
    onEdit: false,
    userListModalShown: false,
    confirmModalShown: false,
    xpRewardInterfaceShown: false
  }

  componentDidMount() {
    const { replyOfReply, forDiscussionPanel } = this.props
    if (replyOfReply && !forDiscussionPanel) scrollElementToCenter(this.Reply)
  }

  render() {
    const {
      authLevel,
      attachStar,
      canDelete,
      canEdit,
      canStar,
      editRewardComment,
      id,
      index,
      innerRef,
      username,
      timeStamp,
      content,
      onEditDone,
      likes,
      userId,
      profilePicId,
      myId,
      stars = [],
      targetUserName,
      targetUserId,
      uploaderAuthLevel
    } = this.props
    const {
      onEdit,
      userListModalShown,
      confirmModalShown,
      xpRewardInterfaceShown
    } = this.state
    const userIsUploader = userId === myId
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel
    const editButtonShown = userIsUploader || userCanEditThis
    const editMenuItems = []
    if (userIsUploader || canEdit) {
      editMenuItems.push({
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      })
    }
    if (userIsUploader || canDelete) {
      editMenuItems.push({
        label: 'Remove',
        onClick: () => this.setState({ confirmModalShown: true })
      })
    }
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }
    return (
      <div
        key={id}
        ref={ref => {
          this.Reply = ref
          innerRef(ref)
        }}
        style={{
          width: '100%',
          display: 'flex',
          marginTop: index !== 0 && '1.5rem',
          position: 'relative'
        }}
      >
        <div
          style={{ width: '10rem', display: 'flex', justifyContent: 'center' }}
        >
          <ProfilePic
            style={{ width: '8rem', height: '8rem' }}
            userId={userId}
            profilePicId={profilePicId}
          />
        </div>
        <div
          style={{
            marginLeft: '1.5rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div>
            <UsernameText
              user={{
                name: username,
                id: userId
              }}
              style={{ fontSize: '2rem' }}
            />{' '}
            <small
              className={css`
                color: ${Color.gray()};
                > a {
                  color: ${Color.gray()};
                }
              `}
            >
              <Link to={`/comments/${id}`}>replied {timeSince(timeStamp)}</Link>
            </small>
          </div>
          <div
            style={{ display: 'flex', width: '100%', flexDirection: 'column' }}
          >
            {targetUserId && (
              <span style={{ color: Color.blue }}>
                to:{' '}
                <UsernameText
                  user={{ name: targetUserName, id: targetUserId }}
                  style={{ fontSize: '1.5rem' }}
                />
              </span>
            )}
            <Fragment>
              {onEdit ? (
                <EditTextArea
                  autoFocus
                  text={content}
                  onCancel={() => this.setState({ onEdit: false })}
                  onEditDone={editedComment =>
                    onEditDone({ editedComment, commentId: id }).then(() =>
                      this.setState({ onEdit: false })
                    )
                  }
                />
              ) : (
                <div style={{ width: '100%' }}>
                  <LongText
                    style={{
                      width: '100%',
                      margin: '1rem 0 2rem 0',
                      paddingBottom: '1rem',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                  >
                    {content}
                  </LongText>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex'
                        }}
                      >
                        <LikeButton
                          onClick={this.onLikeClick}
                          liked={userLikedThis}
                        />
                        <Button
                          transparent
                          style={{ marginLeft: '1rem' }}
                          onClick={this.onReplyButtonClick}
                        >
                          <span className="glyphicon glyphicon-comment" /> Reply
                        </Button>
                        {canStar &&
                          userCanEditThis &&
                          !userIsUploader && (
                            <Button
                              love
                              style={{ marginLeft: '1rem' }}
                              onClick={() =>
                                this.setState({ xpRewardInterfaceShown: true })
                              }
                              disabled={determineXpButtonDisabled({
                                myId,
                                xpRewardInterfaceShown,
                                stars
                              })}
                            >
                              <span className="glyphicon glyphicon-star" />
                              &nbsp;{determineXpButtonDisabled({
                                myId,
                                xpRewardInterfaceShown,
                                stars
                              }) || 'Reward Stars'}
                            </Button>
                          )}
                      </div>
                      <Likers
                        style={{
                          fontSize: '1.2rem',
                          marginTop: '0.5rem',
                          fontWeight: 'bold',
                          color: Color.darkGray()
                        }}
                        userId={myId}
                        likes={likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          </div>
          {xpRewardInterfaceShown && (
            <XPRewardInterface
              stars={stars}
              contentType="comment"
              contentId={id}
              uploaderId={userId}
              onRewardSubmit={data => {
                this.setState({ xpRewardInterfaceShown: false })
                attachStar(data)
              }}
            />
          )}
          <RewardStatus
            noMarginForEditButton
            style={{ marginTop: '0.5rem' }}
            onCommentEdit={editRewardComment}
            stars={stars}
          />
          <ReplyInputArea
            style={{ marginTop: '1rem' }}
            innerRef={ref => (this.ReplyInputArea = ref)}
            onSubmit={this.onReplySubmit}
          />
          {editButtonShown &&
            !onEdit && (
              <DropdownButton
                snow
                direction="left"
                opacity={0.8}
                icon="pencil"
                style={{
                  position: 'absolute',
                  right: 0
                }}
                menuProps={editMenuItems}
              />
            )}
        </div>
        {userListModalShown && (
          <UserListModal
            onHide={() => this.setState({ userListModalShown: false })}
            title="People who liked this reply"
            users={likes}
            description="(You)"
          />
        )}
        {confirmModalShown && (
          <ConfirmModal
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Reply"
            onConfirm={this.onDelete}
          />
        )}
      </div>
    )
  }

  onLikeClick = () => {
    const replyId = this.props.id
    this.props.onLikeClick(replyId)
  }

  onDelete = () => {
    const { id } = this.props
    this.props.onDelete(id)
  }

  onReplyButtonClick = () => {
    this.ReplyInputArea.focus()
  }

  onReplySubmit = reply => {
    const { onReplySubmit, commentId, videoId, id } = this.props
    this.setState({ replyInputShown: false })
    onReplySubmit({
      reply,
      commentId,
      videoId,
      replyId: id,
      replyOfReply: true
    })
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar
  }),
  { attachStar, editRewardComment }
)(Reply)
