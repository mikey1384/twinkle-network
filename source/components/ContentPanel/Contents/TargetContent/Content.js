import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import LikeButton from 'components/Buttons/LikeButton'
import Likers from 'components/Likers'
import { connect } from 'react-redux'
import UserListModal from 'components/Modals/UserListModal'
import InputForm from 'components/Texts/InputForm'
import Comment from './Comment'
import { borderRadius, Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import ContentLink from 'components/ContentLink'
import { timeSince } from 'helpers/timeStampHelpers'
import RewardStatus from 'components/RewardStatus'
import XPRewardInterface from 'components/XPRewardInterface'
import { determineXpButtonDisabled } from 'helpers/domHelpers'
import { css } from 'emotion'

class Content extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canStar: PropTypes.bool,
    comments: PropTypes.array,
    commentId: PropTypes.number,
    content: PropTypes.string,
    contentAvailable: PropTypes.bool.isRequired,
    discussionId: PropTypes.number,
    isDiscussion: PropTypes.bool,
    likes: PropTypes.array,
    methods: PropTypes.object,
    myId: PropTypes.number,
    panelId: PropTypes.number,
    profilePicId: PropTypes.number,
    replyId: PropTypes.number,
    rootContent: PropTypes.string,
    rootId: PropTypes.number.isRequired,
    rootType: PropTypes.string.isRequired,
    stars: PropTypes.array,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    uploader: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    username: PropTypes.string
  }

  state = {
    userListModalShown: false,
    clickListenerState: false,
    replyInputShown: false,
    xpRewardInterfaceShown: false
  }

  render() {
    const {
      authLevel,
      canStar,
      commentId,
      discussionId,
      uploader,
      isDiscussion,
      title,
      content,
      contentAvailable,
      username,
      comments,
      myId,
      profilePicId,
      timeStamp,
      likes = [],
      rootType,
      rootContent,
      rootId,
      replyId,
      stars,
      methods
    } = this.props
    const {
      userListModalShown,
      replyInputShown,
      clickListenerState,
      xpRewardInterfaceShown
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }
    const userIsUploader = myId === uploader.id
    const userCanStarThis = canStar && authLevel > uploader.authLevel
    return (
      <div
        className={css`
          white-space: pre-wrap;
          overflow-wrap: break-word;
          word-break: break-word;
          border-radius: ${borderRadius};
          border-top: 1px solid ${Color.inputBorderGray()};
          border-bottom: 1px solid ${Color.inputBorderGray()};
          padding: 1rem 0;
          background: ${Color.wellGray()};
          margin-bottom: 2rem;
          line-height: 2.3rem;
          .buttons {
            margin-top: 2rem;
            display: flex;
            width: 100%;
            justify-content: space-between;
          }
          .detail-block {
            display: flex;
            justify-content: space-between;
          }
          .root-content {
            color: ${Color.darkGray()};
            font-weight: bold;
          }
          .timestamp {
            color: ${Color.gray()};
            font-size: 1.2rem;
          }
        `}
      >
        {contentAvailable ? (
          <div>
            {!isDiscussion ? (
              <div>
                {rootType === 'question' && (
                  <div style={{ padding: '0.5rem 1rem 1.5rem 1rem' }}>
                    <ContentLink
                      style={{ color: Color.green() }}
                      content={{ id: rootId, title: 'Question: ' }}
                      type="question"
                    />
                    <span className="root-content">{rootContent}</span>
                  </div>
                )}
                <div style={{ padding: '0 1rem' }}>
                  <div
                    className={css`
                      display: flex;
                      flex-direction: column;
                    `}
                  >
                    <div className="detail-block">
                      <div>
                        <UsernameText user={uploader} color={Color.blue()} />{' '}
                        <ContentLink
                          content={{
                            id: replyId || commentId,
                            title: `${
                              replyId
                                ? 'replied'
                                : rootType === 'question'
                                  ? 'answered'
                                  : 'commented'
                            }:`
                          }}
                          type="comment"
                          style={{ color: Color.green() }}
                        />
                      </div>
                      <div>
                        <span className="timestamp">
                          ({timeSince(timeStamp)})
                        </span>
                      </div>
                    </div>
                    <LongText
                      className={css`
                        margin-top: 1rem;
                      `}
                    >
                      {content}
                    </LongText>
                  </div>
                  <div className="buttons">
                    <div>
                      <LikeButton
                        onClick={this.onLikeClick}
                        liked={userLikedThis}
                        small
                      />
                      <Button
                        style={{ marginLeft: '1rem' }}
                        transparent
                        onClick={this.onReplyClick}
                      >
                        <span className="glyphicon glyphicon-comment" />&nbsp;
                        Reply
                      </Button>
                      {canStar &&
                        userCanStarThis &&
                        !userIsUploader && (
                          <Button
                            love
                            disabled={this.determineXpButtonDisabled()}
                            style={{ marginLeft: '1rem' }}
                            onClick={() =>
                              this.setState({ xpRewardInterfaceShown: true })
                            }
                          >
                            <span className="glyphicon glyphicon-star" />{' '}
                            {this.determineXpButtonDisabled() || 'Reward'}
                          </Button>
                        )}
                      <Likers
                        className="content-panel__likers"
                        userId={myId}
                        likes={likes}
                        onLinkClick={() =>
                          this.setState({ userListModalShown: true })
                        }
                      />
                    </div>
                  </div>
                </div>
                {xpRewardInterfaceShown && (
                  <XPRewardInterface
                    contentType={'comment'}
                    contentId={replyId || commentId}
                    uploaderId={uploader.id}
                    stars={stars}
                    onRewardSubmit={data => {
                      this.setState({ xpRewardInterfaceShown: false })
                      methods.attachStar(data)
                    }}
                  />
                )}
                <RewardStatus
                  onCommentEdit={methods.onRewardCommentEdit}
                  style={{
                    marginTop:
                      likes.length > 0 || xpRewardInterfaceShown
                        ? '0.5rem'
                        : '1rem'
                  }}
                  stars={stars}
                  uploaderName={uploader.name}
                />
                {replyInputShown && (
                  <InputForm
                    style={{ marginTop: '1rem', padding: '0 1rem' }}
                    clickListenerState={clickListenerState}
                    autoFocus
                    onSubmit={this.onSubmit}
                    rows={4}
                    placeholder={`Write a reply...`}
                  />
                )}
                {comments.length > 0 && (
                  <div>
                    {comments.map(comment => (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        username={username}
                        userId={myId}
                        profilePicId={profilePicId}
                        onDelete={methods.onDeleteComment}
                        onEditDone={methods.onEditComment}
                      />
                    ))}
                  </div>
                )}
                {userListModalShown && (
                  <UserListModal
                    onHide={() => this.setState({ userListModalShown: false })}
                    title="People who liked this comment"
                    users={likes}
                    description="(You)"
                  />
                )}
              </div>
            ) : (
              <div style={{ padding: '0.5rem 1.5rem' }}>
                <div className="detail-block">
                  <ContentLink
                    content={{ id: discussionId, title: 'Discuss: ' }}
                    type="discussion"
                    style={{ color: Color.green() }}
                  />
                  <div>
                    <UsernameText user={uploader} />&nbsp;<span className="timestamp">
                      ({timeSince(timeStamp)})
                    </span>
                  </div>
                </div>
                <div>
                  <span className="root-content">{title}</span>
                  {content && (
                    <LongText
                      className={css`
                        margin-top: 1rem;
                      `}
                    >
                      {content}
                    </LongText>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <span>Content removed / no longer available</span>
          </div>
        )}
      </div>
    )
  }

  determineXpButtonDisabled = () => {
    const { stars, myId } = this.props
    const { xpRewardInterfaceShown } = this.state
    return determineXpButtonDisabled({ stars, myId, xpRewardInterfaceShown })
  }

  onLikeClick = () => {
    const { replyId, commentId, methods } = this.props
    methods.onLikeClick(replyId || commentId)
  }

  onReplyClick = () => {
    const { replyInputShown, clickListenerState } = this.state
    if (!replyInputShown) return this.setState({ replyInputShown: true })
    this.setState({ clickListenerState: !clickListenerState })
  }

  onSubmit = content => {
    const {
      replyId = null,
      commentId,
      rootType,
      rootId,
      discussionId = null,
      methods,
      panelId
    } = this.props
    methods.uploadComment(
      { rootId, rootType, replyId, commentId, discussionId, content },
      panelId
    )
  }
}

export default connect(state => ({
  authLevel: state.UserReducer.authLevel,
  canStar: state.UserReducer.canStar,
  username: state.UserReducer.username,
  profilePicId: state.UserReducer.profilePicId
}))(Content)
