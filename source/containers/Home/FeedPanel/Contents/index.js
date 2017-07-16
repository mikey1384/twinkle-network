import PropTypes from 'prop-types'
import React, {Component} from 'react'
import LongText from 'components/Texts/LongText'
import LikeButton from 'components/LikeButton'
import Button from 'components/Button'
import Likers from 'components/Likers'
import {connect} from 'react-redux'
import {
  showFeedCommentsAsync,
  loadMoreFeedCommentsAsync,
  uploadFeedComment,
  feedCommentDelete,
  commentFeedLike,
  feedCommentEdit,
  uploadFeedReply,
  loadMoreFeedReplies,
  contentFeedLike
} from 'redux/actions/FeedActions'
import UserListModal from 'components/Modals/UserListModal'
import VideoPlayer from 'components/VideoPlayer'
import Embedly from 'components/Embedly'
import PanelComments from 'components/PanelComments'
import TargetContent from './TargetContent'
import {Color} from 'constants/css'
import {cleanString} from 'helpers/stringHelpers'

@connect(
  null,
  {
    showFeedComments: showFeedCommentsAsync,
    loadMoreComments: loadMoreFeedCommentsAsync,
    onSubmit: uploadFeedComment,
    onDelete: feedCommentDelete,
    onEditDone: feedCommentEdit,
    onReplySubmit: uploadFeedReply,
    onLoadMoreReplies: loadMoreFeedReplies,
    onLikeCommentClick: commentFeedLike,
    onLikeContentClick: contentFeedLike
  }
)
export default class Contents extends Component {
  static propTypes = {
    attachedVideoShown: PropTypes.bool,
    feed: PropTypes.object,
    myId: PropTypes.number,
    loadMoreComments: PropTypes.func,
    onLikeCommentClick: PropTypes.func,
    onLikeContentClick: PropTypes.func,
    onLoadMoreReplies: PropTypes.func,
    onReplySubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    showFeedComments: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      userListModalShown: false,
      clickListenerState: false,
      commentsShown: false
    }
    this.onLikeClick = this.onLikeClick.bind(this)
    this.onCommentButtonClick = this.onCommentButtonClick.bind(this)
    this.loadMoreComments = this.loadMoreComments.bind(this)
  }

  render() {
    const {
      feed: {
        uploaderId, content, contentLikers = [], contentId, type, discussionId, videoViews,
        numChildComments = 0, numChildReplies = 0, replyId, commentId, childComments,
        commentsLoadMoreButton, rootId, rootType, contentTitle, contentDescription,
        rootContent, onDelete, onLikeCommentClick, onEditDone
      }, feed, myId, attachedVideoShown, onLoadMoreReplies, onReplySubmit, onSubmit
    } = this.props
    const {userListModalShown, clickListenerState, commentsShown} = this.state
    let userLikedThis = false
    for (let i = 0; i < contentLikers.length; i++) {
      if (contentLikers[i].userId === myId) userLikedThis = true
    }
    return (
      <div>
        {type === 'comment' && attachedVideoShown &&
          <VideoPlayer
            autoplay
            title={contentTitle}
            style={{marginBottom: '1em'}}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
            videoId={rootId}
            videoCode={rootContent}
          />
        }
        {type === 'comment' && (commentId || replyId || discussionId) &&
          <TargetContent
            feed={feed}
            myId={myId}
          />
        }
        {type === 'comment' &&
          <span style={{
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <LongText>{content}</LongText>
          </span>
        }
        {(type === 'video' || type === 'discussion') &&
          <VideoPlayer
            title={contentTitle}
            containerClassName="embed-responsive embed-responsive-16by9"
            className="embed-responsive-item"
            videoId={rootId}
            videoCode={rootContent}
          />
        }
        {type === 'url' &&
        !!contentDescription && contentDescription !== 'No description' &&
          <div style={{
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <LongText style={{paddingBottom: '1.5em'}}>{contentDescription || ''}</LongText>
          </div>
        }
        {type === 'url' &&
          <Embedly title={cleanString(contentTitle)} url={content} />
        }
        {type === 'discussion' &&
          <div style={{
            fontSize: '2rem',
            marginTop: '1em',
            marginBottom: contentDescription ? '0.5em' : '1em'
          }}>
            <p><b style={{color: Color.green}}>Discuss:</b></p>
            <p>{cleanString(contentTitle)}</p>
          </div>
        }
        {type === 'video' &&
        !!contentDescription && contentDescription !== 'No description' &&
          <div style={{
            marginTop: '1em',
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <LongText>{contentDescription}</LongText>
          </div>
        }
        {type === 'discussion' &&
        !!contentDescription &&
          <div style={{
            marginBottom: '1em',
            fontSize: '1.2em',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            <LongText>{contentDescription}</LongText>
          </div>
        }
        {type === 'video' && videoViews > 10 &&
          <span
            className="pull-right"
            style={{
              fontSize: '1.5em',
              marginTop: '1em'
            }}
          >{videoViews} view{`${videoViews > 1 ? 's' : ''}`}</span>
        }
        {type === 'comment' && rootType === 'url' &&
          <Embedly style={{marginTop: '2em'}} title={cleanString(contentTitle)} url={rootContent} />
        }
        {type !== 'discussion' &&
          <div style={{paddingTop: (type !== 'comment' || rootType !== 'url') ? '2em' : '1.5em'}}>
            <LikeButton
              onClick={this.onLikeClick}
              liked={userLikedThis}
              small
            />
            <Button
              style={{marginLeft: '0.5em'}}
              className="btn btn-warning btn-sm"
              onClick={this.onCommentButtonClick}
            >
              <span className="glyphicon glyphicon-comment"></span>&nbsp;
              {type === 'video' ? 'Comment' : 'Reply'}&nbsp;
              {numChildComments > 0 && !commentsShown ? `(${numChildComments})` :
                (numChildReplies > 0 && !commentsShown ? `(${numChildReplies})` : '')
              }
            </Button>
            {false && myId === uploaderId &&
              <Button
                style={{marginLeft: '0.5em'}}
                className="btn btn-default btn-sm"
                onClick={() => console.log('edit clicked')}
              >
                <span className="glyphicon glyphicon-pencil"></span>&nbsp;Edit&nbsp;
              </Button>
            }
          </div>
        }
        {type === 'discussion' &&
          <Button
            style={{marginTop: '0.5em'}}
            className="btn btn-warning"
            onClick={this.onCommentButtonClick}
          >
            Answer{!!numChildComments && numChildComments > 0 && !commentsShown ? ` (${numChildComments})` : ''}
          </Button>
        }
        <Likers
          style={{
            fontSize: '11px',
            marginTop: '1em',
            fontWeight: 'bold',
            color: Color.green
          }}
          userId={myId}
          likes={contentLikers}
          onLinkClick={() => this.setState({userListModalShown: true})}
        />
        {commentsShown &&
          <PanelComments
            autoFocus
            clickListenerState={clickListenerState}
            inputTypeLabel={type === 'comment' ? 'reply' : 'comment'}
            comments={childComments}
            loadMoreButton={commentsLoadMoreButton}
            userId={myId}
            loadMoreComments={this.loadMoreComments}
            onSubmit={onSubmit}
            contentId={contentId}
            type={type}
            parent={{
              id: contentId,
              type,
              rootId,
              rootType,
              discussionId,
              commentId,
              replyId
            }}
            commentActions={{
              onDelete,
              onLikeClick: onLikeCommentClick,
              onEditDone,
              onReplySubmit,
              onLoadMoreReplies
            }}
          />
        }
        {userListModalShown &&
          <UserListModal
            onHide={() => this.setState({userListModalShown: false})}
            title={`People who liked this ${type}`}
            users={contentLikers}
            description="(You)"
          />
        }
      </div>
    )
  }

  loadMoreComments(lastCommentId, type, contentId) {
    const {loadMoreComments, feed: {commentId}} = this.props
    loadMoreComments(lastCommentId, type, contentId, !!commentId)
  }

  onCommentButtonClick() {
    const {feed: {type, rootType, contentId, commentId}, showFeedComments} = this.props
    const {clickListenerState, commentsShown} = this.state
    const isReply = !!commentId
    if (!commentsShown) {
      this.setState({commentsShown: true})
      return showFeedComments({rootType, type, contentId, commentLength: 0, isReply})
    }
    this.setState({clickListenerState: !clickListenerState})
  }

  onLikeClick() {
    const {feed: {contentId, type, rootType}} = this.props
    if (type === 'comment') {
      this.props.onLikeCommentClick(contentId)
    } else {
      this.props.onLikeContentClick(contentId, rootType)
    }
  }
}
