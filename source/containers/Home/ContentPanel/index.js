import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Heading from './Heading'
import Contents from './Contents'
import Loading from 'components/Loading'

export default class ContentPanel extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired,
    fetchFeed: PropTypes.func.isRequired,
    loadingDisabled: PropTypes.bool,
    onLikeClick: PropTypes.func.isRequired,
    uploadFeedComment: PropTypes.func.isRequired,
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
    const { fetchFeed, feed, loadingDisabled } = this.props
    const { feedLoaded } = this.state
    if (!feedLoaded && !loadingDisabled) {
      this.setState({ feedLoaded: true })
      fetchFeed(feed)
    }
  }

  render() {
    const { feed, onLikeClick, uploadFeedComment, userId } = this.props
    const { attachedVideoShown } = this.state
    return (
      <div
        className="panel panel-default"
        style={{ borderTop: '#e7e7e7 1px solid' }}
      >
        {feed.uploaderName && (
          <Heading
            feed={feed}
            onLikeClick={onLikeClick}
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
            uploadFeedComment={uploadFeedComment}
            onPlayVideoClick={() => this.setState({ attachedVideoShown: true })}
            attachedVideoShown={attachedVideoShown}
          />
        )}
        <div className="panel-body">
          {feed.uploaderName && (
            <Contents
              feed={feed}
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
