import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import Likers from 'components/Likers'
import { connect } from 'react-redux'
import UserListModal from 'components/Modals/UserListModal'
import InputArea from 'components/Texts/InputArea'
import Comment from './Comment'
import { Color } from 'constants/css'
import LongText from 'components/Texts/LongText'
import ContentLink from 'components/ContentLink'
import { timeSince } from 'helpers/timeStampHelpers'

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
        className="well"
        style={{
          wordBreak: 'break-word'
        }}
      >
        {contentAvailable ? (
          !isDiscussion ? (
            <div>
              {rootType === 'question' && (
                <div style={{ marginBottom: '1rem' }}>
                  <ContentLink
                    content={{ id: rootId, title: 'Question: ' }}
                    type="question"
                    style={{ color: Color.green() }}
                  />
                  <span>{rootContent}</span>
                </div>
              )}
              <div
                className="col-xs-12"
                style={{ paddingLeft: '0px', paddingRight: '0px' }}
              >
                <div style={{ float: 'left' }}>
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
                <div style={{ float: 'right' }}>
                  <small>({timeSince(timeStamp)})</small>
                </div>
              </div>
              <div style={{ paddingTop: '2.3em' }}>
                <LongText style={{ marginBottom: '1em' }}>{content}</LongText>
                <LikeButton
                  style={{ marginTop: '1em' }}
                  onClick={this.onLikeClick}
                  liked={userLikedThis}
                  small
                />
                <Button
                  style={{ marginTop: '1em', marginLeft: '0.5em' }}
                  gold
                  onClick={this.onReplyClick}
                >
                  <span className="glyphicon glyphicon-comment" />&nbsp; Reply
                </Button>
                <Likers
                  className="likers"
                  style={{
                    marginBottom: replyInputShown ? '1rem' : null
                  }}
                  userId={myId}
                  likes={likes}
                  onLinkClick={() =>
                    this.setState({ userListModalShown: true })
                  }
                />
              </div>
              {replyInputShown && (
                <div
                  className="media"
                  style={{ marginTop: '0px', lineHeight: '0px' }}
                >
                  <div className="media-body">
                    <InputArea
                      clickListenerState={clickListenerState}
                      autoFocus
                      onSubmit={this.onSubmit}
                      rows={4}
                      placeholder={`Write a reply...`}
                    />
                  </div>
                </div>
              )}
              {comments.length > 0 && (
                <div
                  style={{
                    marginTop: '1em',
                    width: '100%'
                  }}
                >
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
            <div
              style={{
                marginTop: '0.2em',
                marginBottom: '0.2em'
              }}
            >
              <div
                className="col-xs-12"
                style={{ paddingLeft: '0px', paddingRight: '0px' }}
              >
                <div style={{ float: 'left' }}>
                  <ContentLink
                    content={{ id: discussionId, title: 'Discuss: ' }}
                    type="discussion"
                    style={{ color: Color.green() }}
                  />
                </div>
                <div style={{ float: 'right' }}>
                  <small>
                    <UsernameText user={uploader} />&nbsp;({timeSince(
                      timeStamp
                    )})
                  </small>
                </div>
              </div>
              <div style={{ paddingTop: '2.3em' }}>
                <p style={{ fontWeight: 'bold' }}>{title}</p>
                {content && <LongText>{content}</LongText>}
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
