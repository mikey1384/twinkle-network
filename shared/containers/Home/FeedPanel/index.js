import React, {Component, PropTypes} from 'react';
import Button from 'components/Button';
import ContentLink from '../ContentLink';
import UserLink from '../UserLink';
import LikeButton from 'components/LikeButton';
import Textarea from 'react-textarea-autosize';
import InputArea from 'components/InputArea';
import Heading from './Heading';
import MainContent from './MainContent';
import TargetContent from './TargetContent';


export default class FeedPanel extends Component {
  constructor() {
    super()
    this.state = {
      inputBoxShown: false,
      replyLeft: false
    }
  }
  render() {
    const {inputBoxShown, replyLeft} = this.state;
    const {feed, userId} = this.props;
    return (
      <div
        className="panel panel-default"
        style={{borderTop: '#e7e7e7 1px solid'}}
      >
        <Heading
          {...feed}
          targetCommentUploader={!!feed.targetCommentUploaderName && {name: feed.targetCommentUploaderName, id: feed.targetCommentUploaderId}}
          targetReplyUploader={!!feed.targetReplyUploaderName && {name: feed.targetReplyUploaderName, id: feed.targetReplyUploaderId}}
          parentContent={{id: feed.parentContentId, title: feed.contentTitle}}
          action={!!feed.commentId ? 'replied to' : 'commented on'}
          uploader={{name: feed.uploaderName, id: feed.uploaderId}}
        />
        <div className="panel-body">
          {feed.type === 'comment' && !!feed.replyId &&
            <TargetContent
              isReplyContent={true}
              uploader={{name: feed.targetReplyUploaderName, id: feed.targetReplyUploaderId}}
              likes={feed.targetContentLikers}
              content={feed.targetReply}
              myId={userId}
              contentId={feed.replyId}
            />
          }
          {feed.type === 'comment' && !!feed.commentId && !feed.replyId &&
            <TargetContent
              uploader={{name: feed.targetCommentUploaderName, id: feed.targetCommentUploaderId}}
              likes={feed.targetContentLikers}
              content={feed.targetComment}
              myId={userId}
              contentId={feed.commentId}
            />
          }
          <MainContent
            {...feed}
            myId={userId}
          />
        </div>
      </div>
    )
  }
}
