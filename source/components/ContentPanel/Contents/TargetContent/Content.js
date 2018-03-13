import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import Likers from 'components/Likers'
import { connect } from 'react-redux'
import UserListModal from 'components/Modals/UserListModal'
import InputForm from 'components/Texts/InputForm'
import Comment from './Comment'
import { borderRadius, Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import ContentLink from 'components/ContentLink'
import { timeSince } from 'helpers/timeStampHelpers'
import { css } from 'emotion'

class Content extends Component {
  static propTypes = {
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
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    uploader: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    username: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      userListModalShown: false,
      clickListenerState: false,
      replyInputShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onReplyClick = this.onReplyClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render() {
    const {
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
      methods
    } = this.props
    const {
      userListModalShown,
      replyInputShown,
      clickListenerState
    } = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }
    return (
      <div
        className={css`
          word-break: break-word;
          border-radius: ${borderRadius};
          border-top: 1px solid ${Color.inputBorderGray()};
          border-bottom: 1px solid ${Color.inputBorderGray()};
          padding: 1.5rem 1.5rem
            ${!contentAvailable || isDiscussion ? '1.5rem' : '1rem'} 1.5rem;
          background: ${Color.whiteGray()};
          margin-bottom: 2rem;
          line-height: 2.3rem;
          .buttons {
            margin-top: 2rem;
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
          !isDiscussion ? (
            <div>
              {rootType === 'question' && (
                <div
                  className={css`
                    margin-bottom: 1rem;
                  `}
                >
                  <ContentLink
                    style={{ color: Color.green() }}
                    content={{ id: rootId, title: 'Question: ' }}
                    type="question"
                  />
                  <span className="root-content">{rootContent}</span>
                </div>
              )}
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
                            : rootType === 'question' ? 'answered' : 'commented'
                        }:`
                      }}
                      type="comment"
                      style={{ color: Color.green() }}
                    />
                  </div>
                  <div>
                    <span className="timestamp">({timeSince(timeStamp)})</span>
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
                  <span className="glyphicon glyphicon-comment" />&nbsp; Reply
                </Button>
                <Likers
                  className="content-panel__likers"
                  userId={myId}
                  likes={likes}
                  onLinkClick={() =>
                    this.setState({ userListModalShown: true })
                  }
                />
              </div>
              {replyInputShown && (
                <InputForm
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
            <div>
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
          )
        ) : (
          <div style={{ textAlign: 'center' }}>
            <span>Content removed / no longer available</span>
          </div>
        )}
      </div>
    )
  }

  onLikeClick() {
    const { replyId, commentId, methods } = this.props
    methods.onLikeClick(replyId || commentId)
  }

  onReplyClick() {
    const { replyInputShown, clickListenerState } = this.state
    if (!replyInputShown) return this.setState({ replyInputShown: true })
    this.setState({ clickListenerState: !clickListenerState })
  }

  onSubmit(content) {
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
  username: state.UserReducer.username,
  profilePicId: state.UserReducer.profilePicId
}))(Content)
