import PropTypes from 'prop-types'
import React, {Component} from 'react'
import UserLink from 'containers/Home/UserLink'
import UsernameText from 'components/Texts/UsernameText'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import Likers from 'components/Likers'
import {connect} from 'react-redux'
import {
  feedCommentDelete,
  feedCommentEdit,
  likeTargetComment,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import UserListModal from 'components/Modals/UserListModal'
import InputArea from 'components/Texts/InputArea'
import Comment from './Comment'
import {Color} from 'constants/css'
import LongText from 'components/Texts/LongText'
import {timeSince} from 'helpers/timeStampHelpers'

class Content extends Component {
  static propTypes = {
    comments: PropTypes.array,
    commentId: PropTypes.number,
    content: PropTypes.string,
    contentAvailable: PropTypes.bool.isRequired,
    discussionId: PropTypes.number,
    isDiscussion: PropTypes.bool,
    likes: PropTypes.array,
    myId: PropTypes.number,
    onDeleteComment: PropTypes.func.isRequired,
    onEditComment: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    panelId: PropTypes.number.isRequired,
    profilePicId: PropTypes.number,
    replyId: PropTypes.number,
    rootContent: PropTypes.string,
    rootId: PropTypes.number.isRequired,
    rootType: PropTypes.string.isRequired,
    timeStamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    title: PropTypes.string,
    uploadComment: PropTypes.func.isRequired,
    uploader: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
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
    const {uploader, isDiscussion, title, content, contentAvailable, username, comments,
      myId, profilePicId, timeStamp, likes = [], rootType, rootContent, replyId, onDeleteComment, onEditComment
    } = this.props
    const {userListModalShown, replyInputShown, clickListenerState} = this.state
    let userLikedThis = false
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].userId === myId) userLikedThis = true
    }
    return (
      <div
        className="well"
        style={{
          marginTop: '1em',
          wordBreak: 'break-word'
        }}
      >
        {contentAvailable ?
          (!isDiscussion ?
            <div>
              {rootType === 'question' &&
                <div style={{fontSize: '1.2em', marginBottom: '1em'}}>
                  <span style={{color: Color.green, fontWeight: 'bold'}}>Question: </span><span>{rootContent}</span>
                </div>
              }
              <div className="col-xs-12" style={{paddingLeft: '0px', paddingRight: '0px'}}>
                <div style={{float: 'left'}}>
                  <UserLink user={uploader} />
                  &nbsp;{replyId ? 'wrote' : rootType === 'question' ? 'answered' : 'commented'}:
                </div>
                <div style={{float: 'right'}}><small>({timeSince(timeStamp)})</small></div>
              </div>
              <div style={{paddingTop: '2.3em'}}>
                <LongText style={{marginBottom: '1em'}}>{content}</LongText>
                <LikeButton
                  style={{marginTop: '1em'}}
                  onClick={this.onLikeClick}
                  liked={userLikedThis}
                  small
                />
                <Button
                  style={{marginTop: '1em', marginLeft: '0.5em'}}
                  className="btn btn-warning btn-sm"
                  onClick={this.onReplyClick}
                >
                  <span className="glyphicon glyphicon-comment"></span>&nbsp;
                  Reply
                </Button>
                <Likers
                  style={{
                    fontSize: '11px',
                    marginTop: '1em',
                    marginBottom: replyInputShown ? '1em' : null,
                    fontWeight: 'bold',
                    color: Color.green
                  }}
                  userId={myId}
                  likes={likes}
                  onLinkClick={() => this.setState({userListModalShown: true})}
                />
              </div>
              {replyInputShown &&
                <div className="media" style={{marginTop: '0px', lineHeight: '0px'}}>
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
              }
              {(comments.length > 0) &&
                <ul className="media-list" style={{marginTop: '1em', marginBottom: '0px', lineHeight: '0px'}}>
                  {comments.map(comment =>
                    <Comment
                      key={comment.id}
                      comment={comment}
                      username={username}
                      userId={myId}
                      profilePicId={profilePicId}
                      onDelete={onDeleteComment}
                      onEditDone={onEditComment}
                    />
                  )}
                </ul>
              }
              {userListModalShown &&
                <UserListModal
                  onHide={() => this.setState({userListModalShown: false})}
                  title="People who liked this comment"
                  users={likes}
                  description="(You)"
                />
              }
            </div> :
            <div
              style={{
                marginTop: '0.2em',
                marginBottom: '0.2em'
              }}
            >
              <div className="col-xs-12" style={{paddingLeft: '0px', paddingRight: '0px'}}>
                <div style={{float: 'left'}}><b style={{color: Color.green}}>Discuss: </b></div>
                <div style={{float: 'right'}}><small><UsernameText user={uploader} />&nbsp;({timeSince(timeStamp)})</small></div>
              </div>
              <div style={{paddingTop: '2.3em'}}>
                <p style={{fontWeight: 'bold'}}>{title}</p>
                {content && (
                  <LongText>{content}</LongText>
                )}
              </div>
            </div>
          ) : <div style={{textAlign: 'center'}}><span>Content removed / no longer available</span></div>
        }
      </div>
    )
  }

  onLikeClick() {
    const {replyId, commentId} = this.props
    this.props.onLikeClick(replyId || commentId)
  }

  onReplyClick() {
    const {replyInputShown, clickListenerState} = this.state
    if (!replyInputShown) return this.setState({replyInputShown: true})
    this.setState({clickListenerState: !clickListenerState})
  }

  onSubmit(content) {
    const {replyId = null, commentId, rootType, rootId, discussionId = null, uploadComment, panelId} = this.props
    uploadComment({rootId, rootType, replyId, commentId, discussionId, content}, panelId)
  }
}

export default connect(
  state => ({
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId
  }),
  {
    onDeleteComment: feedCommentDelete,
    onEditComment: feedCommentEdit,
    onLikeClick: likeTargetComment,
    uploadComment: uploadTargetContentComment
  }
)(Content)
