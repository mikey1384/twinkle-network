import React, {Component, PropTypes} from 'react'
import Heading from './Heading'
import MainContent from './MainContent'

export default class FeedPanel extends Component {
  static propTypes = {
    feed: PropTypes.object,
    userId: PropTypes.number,
    onLikeVideoClick: PropTypes.func
  }

  constructor() {
    super()
    this.state = {
      attachedVideoShown: false
    }
  }

  render() {
    const {feed, userId, onLikeVideoClick} = this.props
    const {attachedVideoShown} = this.state
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <Heading
          {...feed}
          myId={userId}
          targetCommentUploader={!!feed.targetCommentUploaderName && {name: feed.targetCommentUploaderName, id: feed.targetCommentUploaderId}}
          targetReplyUploader={!!feed.targetReplyUploaderName && {name: feed.targetReplyUploaderName, id: feed.targetReplyUploaderId}}
          parentContent={{id: feed.parentContentId, title: feed.parentContentTitle}}
          action={feed.commentId ? 'replied to' : 'commented on'}
          uploader={{name: feed.uploaderName, id: feed.uploaderId}}
          onPlayVideoClick={() => this.setState({attachedVideoShown: true})}
          attachedVideoShown={attachedVideoShown}
          onLikeVideoClick={onLikeVideoClick}
        />
        <div className="panel-body">
          <MainContent
            {...feed}
            onLikeVideoClick={onLikeVideoClick}
            attachedVideoShown={attachedVideoShown}
            myId={userId}
          />
        </div>
      </div>
    )
  }
}
