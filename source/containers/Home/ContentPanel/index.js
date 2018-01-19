import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Heading from './Heading'
import Contents from './Contents'
import Loading from 'components/Loading'

export default class ContentPanel extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired,
    loadingDisabled: PropTypes.bool,
    userId: PropTypes.number,
    methodObj: PropTypes.shape({
      ContentPanel: PropTypes.shape({
        fetchContent: PropTypes.func.isRequired
      }),
      Heading: PropTypes.object,
      Contents: PropTypes.object
    })
  }

  constructor() {
    super()
    this.state = {
      attachedVideoShown: false,
      feedLoaded: false
    }
  }

  componentDidMount() {
    const { methodObj, feed, loadingDisabled } = this.props
    const { feedLoaded } = this.state
    if (!feedLoaded && !loadingDisabled) {
      this.setState({ feedLoaded: true })
      methodObj.onFetchContent(feed)
    }
  }

  render() {
    const { feed, methodObj, userId } = this.props
    const { attachedVideoShown } = this.state
    const methods = {
      Heading: {
        onUploadAnswer: methodObj.onCommentSubmit,
        onLikeClick: methodObj.onLikeContent
      },
      Contents: {
        commentActions: {
          onDelete: methodObj.onDeleteComment,
          onLikeClick: methodObj.onLikeComment,
          onEditDone: methodObj.onEditComment,
          onReplySubmit: methodObj.onReplySubmit,
          onLoadMoreReplies: methodObj.onLoadMoreReplies
        },
        feedVideoStar: methodObj.onVideoStar,
        loadMoreComments: methodObj.onLoadMoreComments,
        onCommentSubmit: methodObj.onCommentSubmit,
        onContentDelete: methodObj.onDeleteContent,
        onLikeCommentClick: methodObj.onLikeComment,
        onLikeQuestionClick: methodObj.onLikeQuestion,
        onLikeContentClick: methodObj.onLikeContent,
        showFeedComments: methodObj.onShowComments,
        TargetContent: {
          onDeleteComment: methodObj.onDeleteComment,
          onEditComment: methodObj.onEditComment,
          onLikeClick: methodObj.onLikeTargetComment,
          uploadComment: methodObj.onTargetCommentSubmit
        }
      }
    }

    return (
      <div
        className="panel panel-default"
        style={{ borderTop: '#e7e7e7 1px solid' }}
      >
        {feed.uploaderName && (
          <Heading
            feed={feed}
            methods={methods.Heading}
            myId={userId}
            targetCommentUploader={
              feed.targetCommentUploaderName && {
                name: feed.targetCommentUploaderName,
                id: feed.targetCommentUploaderId
              }
            }
            targetReplyUploader={
              feed.targetReplyUploaderName && {
                name: feed.targetReplyUploaderName,
                id: feed.targetReplyUploaderId
              }
            }
            rootContent={{
              id: feed.rootId,
              title: feed.rootContentTitle,
              content: feed.rootContent,
              isStarred: feed.rootContentIsStarred
            }}
            action={
              feed.commentId
                ? 'replied to'
                : feed.rootType === 'question' ? 'answered' : 'commented on'
            }
            uploader={{ name: feed.uploaderName, id: feed.uploaderId }}
            onPlayVideoClick={() => this.setState({ attachedVideoShown: true })}
            attachedVideoShown={attachedVideoShown}
          />
        )}
        <div className="panel-body">
          {feed.uploaderName && (
            <Contents
              feed={feed}
              methods={methods.Contents}
              attachedVideoShown={attachedVideoShown}
              myId={userId}
            />
          )}
          {!feed.uploaderName && <Loading />}
        </div>
      </div>
    )
  }
}
