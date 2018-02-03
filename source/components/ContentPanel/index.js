import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Heading from './Heading'
import Contents from './Contents'
import Loading from 'components/Loading'

export default class ContentPanel extends Component {
  static propTypes = {
    contentObj: PropTypes.object.isRequired,
    methodObj: PropTypes.object.isRequired,
    selfLoadingDisabled: PropTypes.bool,
    userId: PropTypes.number
  }

  constructor() {
    super()
    this.state = {
      attachedVideoShown: false,
      feedLoaded: false
    }
  }

  componentDidMount() {
    const { methodObj, contentObj, selfLoadingDisabled } = this.props
    const { feedLoaded } = this.state
    if (!feedLoaded && !selfLoadingDisabled) {
      this.setState({ feedLoaded: true })
      methodObj.onFetchContent(contentObj)
    }
  }

  render() {
    const { contentObj, methodObj, userId } = this.props
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
        onContentEdit: methodObj.onEditContent,
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
        {contentObj.uploaderName && (
          <Heading
            contentObj={contentObj}
            methods={methods.Heading}
            myId={userId}
            targetCommentUploader={
              contentObj.targetCommentUploaderName && {
                name: contentObj.targetCommentUploaderName,
                id: contentObj.targetCommentUploaderId
              }
            }
            targetReplyUploader={
              contentObj.targetReplyUploaderName && {
                name: contentObj.targetReplyUploaderName,
                id: contentObj.targetReplyUploaderId
              }
            }
            rootContent={{
              id: contentObj.rootId,
              title: contentObj.rootContentTitle,
              content: contentObj.rootContent,
              isStarred: contentObj.rootContentIsStarred
            }}
            action={
              contentObj.commentId
                ? 'replied to'
                : contentObj.rootType === 'question' ? 'answered' : 'commented on'
            }
            uploader={{ name: contentObj.uploaderName, id: contentObj.uploaderId }}
            onPlayVideoClick={() => this.setState({ attachedVideoShown: true })}
            attachedVideoShown={attachedVideoShown}
          />
        )}
        <div className="panel-body">
          {contentObj.uploaderName && (
            <Contents
              contentObj={contentObj}
              methods={methods.Contents}
              attachedVideoShown={attachedVideoShown}
              myId={userId}
            />
          )}
          {!contentObj.uploaderName && <Loading />}
        </div>
      </div>
    )
  }
}
