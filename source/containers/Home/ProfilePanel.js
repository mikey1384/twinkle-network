/* global FileReader */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import Button from 'components/Button'
import ImageEditModal from 'components/Modals/ImageEditModal'
import BioEditModal from 'components/Modals/BioEditModal'
import {
  removeStatusMsg,
  updateStatusMsg,
  uploadProfilePic,
  uploadBio
} from 'redux/actions/UserActions'
import { openDirectMessageChannel } from 'redux/actions/ChatActions'
import AlertModal from 'components/Modals/AlertModal'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { borderRadius, Color, mobileMaxWidth } from 'constants/css'
import { css } from 'emotion'
import { loadComments } from 'helpers/requestHelpers'
import { timeSince } from 'helpers/timeStampHelpers'
import RankBar from 'components/RankBar'
import Icon from 'components/Icon'
import Comments from 'components/Comments'
import Link from 'components/Link'
import UserDetails from 'components/UserDetails'

class ProfilePanel extends Component {
  static propTypes = {
    expandable: PropTypes.bool,
    history: PropTypes.object,
    isCreator: PropTypes.bool,
    isProfilePage: PropTypes.bool,
    updateStatusMsg: PropTypes.func,
    openDirectMessageChannel: PropTypes.func,
    profile: PropTypes.object,
    removeStatusMsg: PropTypes.func,
    userId: PropTypes.number,
    uploadBio: PropTypes.func,
    uploadProfilePic: PropTypes.func
  }

  state = {
    comments: [],
    commentsShown: false,
    commentsLoadMoreButton: false,
    confirmModalShown: false,
    imageUri: null,
    processing: false,
    imageEditModalShown: false,
    mouseEnteredProfile: false,
    bioEditModalShown: false,
    alertModalShown: false
  }

  async componentDidMount() {
    const { profile } = this.props
    try {
      const { comments } = await loadComments({
        id: profile.id,
        type: 'user',
        limit: 1
      })
      this.setState({ comments })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const {
      comments,
      commentsShown,
      commentsLoadMoreButton,
      imageUri,
      imageEditModalShown,
      bioEditModalShown,
      alertModalShown,
      mouseEnteredProfile,
      processing
    } = this.state
    const {
      history,
      profile,
      userId,
      expandable,
      isCreator,
      isProfilePage,
      openDirectMessageChannel,
      updateStatusMsg,
      uploadBio
    } = this.props
    const canEdit = userId === profile.id || isCreator
    const { profileFirstRow, profileSecondRow, profileThirdRow } = profile
    const noProfile = !profileFirstRow && !profileSecondRow && !profileThirdRow
    return (
      <div
        key={profile.id}
        className={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 1rem;
          line-height: 2.3rem;
          font-size: 1.5rem;
          position: relative;
        `}
      >
        <div
          className={css`
            background: #fff;
            padding: 1rem;
            border: #e7e7e7 1px solid;
            border-top-left-radius: ${borderRadius};
            border-top-right-radius: ${borderRadius};
            ${
              profile.twinkleXP
                ? 'border-bottom: none;'
                : `
                border-bottom-left-radius: ${borderRadius};
                border-bottom-right-radius: ${borderRadius};
              `
            }
            @media (max-width: ${mobileMaxWidth}) {
              border-radius: 0;
              border-left: none;
              border-right: none;
            }
          `}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            <div
              style={{
                width: '20rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                onMouseEnter={() =>
                  this.setState({ mouseEnteredProfile: true })
                }
                onMouseLeave={() =>
                  this.setState({ mouseEnteredProfile: false })
                }
              >
                <Link to={isProfilePage ? null : `/users/${profile.username}`}>
                  <ProfilePic
                    style={{ width: '18rem', height: '18rem' }}
                    userId={profile.id}
                    profilePicId={profile.profilePicId}
                    online={userId === profile.id || !!profile.online}
                    large
                  />
                </Link>
              </div>
              {!isProfilePage && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1.5rem'
                  }}
                >
                  <Button
                    warning
                    transparent
                    style={{ color: mouseEnteredProfile && Color.orange() }}
                    onClick={() => history.push(`/users/${profile.username}`)}
                  >
                    View Profile
                  </Button>
                </div>
              )}
            </div>
            <div
              style={{
                marginLeft: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                width: 'CALC(100% - 18rem)'
              }}
            >
              <UserDetails
                profile={profile}
                isProfilePage={isProfilePage}
                updateStatusMsg={updateStatusMsg}
                uploadBio={uploadBio}
                userId={userId}
              />
              {canEdit && (
                <div
                  style={{
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <Button
                      transparent
                      onClick={this.onChangeProfilePictureClick}
                    >
                      Change Pic
                    </Button>
                    <Button
                      transparent
                      onClick={() => this.setState({ bioEditModalShown: true })}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Edit Bio
                    </Button>
                    {profile.id === userId &&
                      comments.length > 0 &&
                      this.renderMessagesButton({
                        style: { marginLeft: '0.5rem' }
                      })}
                  </div>
                </div>
              )}
              {expandable &&
                userId !== profile.id && (
                  <div
                    style={{
                      marginTop: noProfile ? '2rem' : '1rem',
                      display: 'flex'
                    }}
                  >
                    {this.renderMessagesButton()}
                    <Button
                      style={{ marginLeft: '0.5rem' }}
                      success
                      onClick={() =>
                        openDirectMessageChannel(
                          { userId },
                          { userId: profile.id, username: profile.username },
                          false
                        )
                      }
                    >
                      <Icon icon="comments" />
                      <span style={{ marginLeft: '0.7rem' }}>Talk</span>
                    </Button>
                  </div>
                )}
              {profile.lastActive &&
                !profile.online &&
                profile.id !== userId && (
                  <div
                    style={{
                      marginTop: '1rem',
                      fontSize: '1.5rem',
                      color: Color.gray()
                    }}
                  >
                    <p>last online {timeSince(profile.lastActive)}</p>
                  </div>
                )}
            </div>
            <input
              ref={ref => {
                this.fileInput = ref
              }}
              style={{ display: 'none' }}
              type="file"
              onChange={this.handlePicture}
              accept="image/*"
            />
            {bioEditModalShown && (
              <BioEditModal
                firstLine={profileFirstRow}
                secondLine={profileSecondRow}
                thirdLine={profileThirdRow}
                onSubmit={this.uploadBio}
                onHide={() =>
                  this.setState({
                    bioEditModalShown: false
                  })
                }
              />
            )}
            {imageEditModalShown && (
              <ImageEditModal
                imageUri={imageUri}
                onHide={() =>
                  this.setState({
                    imageUri: null,
                    imageEditModalShown: false,
                    processing: false
                  })
                }
                processing={processing}
                onConfirm={this.uploadImage}
              />
            )}
          </div>
          <Comments
            autoFocus
            comments={comments}
            commentsLoadLimit={20}
            commentsShown={commentsShown}
            contentId={profile.id}
            inputAreaInnerRef={ref => (this.CommentInputArea = ref)}
            inputTypeLabel={`message to ${profile.username}`}
            loadMoreButton={commentsLoadMoreButton}
            loadMoreComments={this.onLoadMoreComments}
            noInput={profile.id === userId}
            numPreviews={3}
            onAttachStar={this.onAttachStar}
            onCommentSubmit={this.onCommentSubmit}
            onDelete={this.onDeleteComment}
            onEditDone={this.onEditComment}
            onLikeClick={this.onLikeComment}
            onLoadMoreReplies={this.onLoadMoreReplies}
            onReplySubmit={this.onReplySubmit}
            onRewardCommentEdit={this.onEditRewardComment}
            parent={{ ...profile, type: 'user' }}
            style={{ marginTop: '1rem' }}
            userId={userId}
          />
        </div>
        {!!profile.twinkleXP && <RankBar profile={profile} />}
        {alertModalShown && (
          <AlertModal
            title="Image is too large (limit: 5mb)"
            content="Please select a smaller image"
            onHide={() => this.setState({ alertModalShown: false })}
          />
        )}
      </div>
    )
  }

  handlePicture = event => {
    const reader = new FileReader()
    const maxSize = 5000
    const file = event.target.files[0]
    if (file.size / 1000 > maxSize) {
      return this.setState({ alertModalShown: true })
    }
    reader.onload = upload => {
      this.setState({
        imageEditModalShown: true,
        imageUri: upload.target.result
      })
    }

    reader.readAsDataURL(file)
    event.target.value = null
  }

  onAttachStar = star => {
    this.setState(state => ({
      comments: state.comments.map(comment => {
        return {
          ...comment,
          stars:
            comment.id === star.contentId
              ? (comment.stars || []).concat(star)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === star.contentId
                ? (reply.stars || []).concat(star)
                : reply.stars || []
          }))
        }
      })
    }))
  }

  onCommentSubmit = comment => {
    this.setState(state => ({
      comments: [comment].concat(state.comments)
    }))
  }

  onChangeProfilePictureClick = () => {
    this.fileInput.click()
  }

  onDeleteComment = commentId => {
    this.setState(state => {
      const comments = state.comments.filter(
        comment => comment.id !== commentId
      )
      return {
        comments: comments.map(comment => ({
          ...comment,
          replies: (comment.replies || []).filter(
            reply => reply.id !== commentId
          )
        }))
      }
    })
  }

  onEditComment = ({ editedComment, commentId }) => {
    this.setState(state => {
      return {
        comments: state.comments.map(comment => ({
          ...comment,
          content: comment.id === commentId ? editedComment : comment.content,
          replies: comment.replies
            ? comment.replies.map(
                reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        content: editedComment
                      }
                    : reply
              )
            : []
        }))
      }
    })
  }

  onEditRewardComment = ({ id, text }) => {
    this.setState(state => ({
      comments: state.comments.map(comment => ({
        ...comment,
        stars: comment.stars
          ? comment.stars.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            }))
          : [],
        replies: comment.replies.map(reply => ({
          ...reply,
          stars: reply.stars
            ? reply.stars.map(star => ({
                ...star,
                rewardComment: star.id === id ? text : star.rewardComment
              }))
            : []
        }))
      }))
    }))
  }

  onExpandComments = async() => {
    const { profile, userId } = this.props
    const { comments, loadMoreButton } = await loadComments({
      id: profile.id,
      type: 'user',
      limit: 5
    })
    this.setState({
      comments,
      commentsShown: true,
      commentsLoadMoreButton: loadMoreButton
    })
    if (profile.id !== userId) this.CommentInputArea.focus()
  }

  onLikeComment = ({ commentId, likes }) => {
    this.setState(state => {
      return {
        comments: state.comments.map(comment => ({
          ...comment,
          likes: comment.id === commentId ? likes : comment.likes,
          replies: comment.replies
            ? comment.replies.map(
                reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        likes
                      }
                    : reply
              )
            : []
        }))
      }
    })
  }

  onLoadMoreComments = ({ comments, loadMoreButton }) => {
    this.setState(state => ({
      comments: state.comments.concat(comments),
      commentsLoadMoreButton: loadMoreButton
    }))
  }

  onLoadMoreReplies = ({ commentId, replies, loadMoreButton }) => {
    this.setState(state => ({
      comments: state.comments.map(comment => ({
        ...comment,
        replies:
          comment.id === commentId
            ? replies.concat(comment.replies)
            : comment.replies,
        loadMoreButton:
          comment.id === commentId ? loadMoreButton : comment.loadMoreButton
      }))
    }))
  }

  onReplySubmit = data => {
    this.setState(state => ({
      comments: state.comments.map(comment => {
        let match = false
        let commentId = data.replyId || data.commentId
        if (comment.id === commentId) {
          match = true
        } else {
          for (let reply of comment.replies || []) {
            if (reply.id === commentId) {
              match = true
              break
            }
          }
        }
        return {
          ...comment,
          replies: match ? comment.replies.concat([data]) : comment.replies
        }
      })
    }))
  }

  renderMessagesButton = (props = {}) => {
    const {
      profile: { id, numMessages },
      userId
    } = this.props
    const { commentsShown } = this.state
    return (
      <Button
        {...props}
        disabled={commentsShown && id === userId}
        logo
        onClick={this.onExpandComments}
      >
        <Icon icon="comment-alt" />
        <span style={{ marginLeft: '0.7rem' }}>
          Message
          {Number(numMessages) > 0 && !commentsShown
            ? `${numMessages > 1 ? 's' : ''} (${numMessages})`
            : ''}
        </span>
      </Button>
    )
  }

  uploadBio = async params => {
    const { profile, uploadBio } = this.props
    await uploadBio({ ...params, profileId: profile.id })
    this.setState({
      bioEditModalShown: false
    })
  }

  uploadImage = async image => {
    const { uploadProfilePic } = this.props
    this.setState({
      processing: true
    })
    await uploadProfilePic(image)
    this.setState({
      imageUri: null,
      processing: false,
      imageEditModalShown: false
    })
  }
}

export default connect(
  state => ({
    isCreator: state.UserReducer.isCreator,
    userId: state.UserReducer.userId
  }),
  {
    removeStatusMsg,
    updateStatusMsg,
    uploadProfilePic,
    uploadBio,
    openDirectMessageChannel
  }
)(withRouter(ProfilePanel))
