import React, {Component, PropTypes} from 'react'
import UserLink from '../UserLink'
import Button from 'components/Button'
import LikeButton from 'components/LikeButton'
import Likers from 'components/Likers'
import {connect} from 'react-redux'
import {
  feedVideoCommentDeleteAsync,
  feedVideoCommentEditAsync,
  likeTargetVideoCommentAsync,
  uploadTargetContentComment
} from 'redux/actions/FeedActions'
import UserListModal from 'components/Modals/UserListModal'
import InputArea from 'components/InputArea'
import TargetContentComment from './TargetContentComment'
import {Color} from 'constants/css'

@connect(
  state => ({
    username: state.UserReducer.username,
    profilePicId: state.UserReducer.profilePicId
  }),
  {
    onDeleteComment: feedVideoCommentDeleteAsync,
    onEditComment: feedVideoCommentEditAsync,
    onLikeClick: likeTargetVideoCommentAsync,
    uploadComment: uploadTargetContentComment
  }
)
export default class TargetContent extends Component {
  static propTypes = {
    uploader: PropTypes.object,
    isDiscussion: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    contentAvailable: PropTypes.bool,
    username: PropTypes.string,
    comments: PropTypes.array,
    myId: PropTypes.number,
    profilePicId: PropTypes.number,
    likes: PropTypes.array,
    replyId: PropTypes.number,
    onDeleteComment: PropTypes.func,
    onEditComment: PropTypes.func,
    commentId: PropTypes.number,
    onLikeClick: PropTypes.func,
    parentContentId: PropTypes.number,
    discussionId: PropTypes.number,
    panelId: PropTypes.number,
    uploadComment: PropTypes.func
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
      myId, profilePicId, likes = [], replyId, onDeleteComment, onEditComment
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
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}
      >
        {contentAvailable ?
          (!isDiscussion ?
            <div>
              <UserLink user={uploader} /> {replyId ? 'wrote' : 'commented'}:
              <p style={{marginTop: '0.5em'}} dangerouslySetInnerHTML={{__html: content}} />
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
                  fontWeight: 'bold',
                  color: Color.green
                }}
                userId={myId}
                likes={likes}
                onLinkClick={() => this.setState({userListModalShown: true})}
              />
              {replyInputShown &&
                <div className="media" style={{marginTop: '0px', lineHeight: '0px'}}>
                  <div className="media-body">
                    <InputArea
                      formGroupStyle={{marginBottom: '0px'}}
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
                <ul className="media-list" style={{marginTop: '0.3em', marginBottom: '0px', lineHeight: '0px'}}>
                  {comments.map(comment =>
                    <TargetContentComment
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
                  userId={myId}
                  users={likes}
                  description={user => user.userId === myId && '(You)'}
                />
              }
            </div> :
            <div
              style={{
                marginTop: '0.2em',
                marginBottom: '0.2em'
              }}
            >
              <p
                style={{
                  fontWeight: 'bold',
                  color: Color.green
                }}
              >
                Discuss:
              </p>
              <p style={{fontWeight: 'bold'}}>{title}</p>
              {!!content && <p dangerouslySetInnerHTML={{__html: content}}/>}
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
    const {replyId = null, commentId, parentContentId, discussionId = null, uploadComment, panelId} = this.props
    uploadComment({videoId: parentContentId, replyId, commentId, discussionId, content}, panelId)
  }
}
