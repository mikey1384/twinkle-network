import React from 'react'
import PropTypes from 'prop-types'
import Content from './Content'
import {cleanString} from 'helpers/stringHelpers'

TargetContent.propTypes = {
  myId: PropTypes.number,
  feed: PropTypes.object
}
export default function TargetContent({
  myId, feed: {
    commentId, discussionId, discussionDescription, discussionTitle, id, replyId,
    rootId, rootType, targetComment, targetCommentUploaderId, targetCommentUploaderName,
    targetContentComments = [], targetContentLikers, targetReply, targetReplyUploaderName,
    targetReplyUploaderId
  }
}) {
  return (
    <div>
      {replyId &&
        <Content
          myId={myId}
          commentId={commentId}
          comments={targetContentComments}
          content={targetReply}
          contentAvailable={!!targetReply}
          discussionId={discussionId}
          likes={targetContentLikers}
          panelId={id}
          replyId={replyId}
          rootId={rootId}
          rootType={rootType}
          uploader={{name: targetReplyUploaderName, id: targetReplyUploaderId}}
        />
      }
      {commentId && !replyId &&
        <Content
          commentId={commentId}
          comments={targetContentComments}
          content={targetComment}
          contentAvailable={!!targetComment}
          discussionId={discussionId}
          likes={targetContentLikers}
          myId={myId}
          panelId={id}
          rootId={rootId}
          rootType={rootType}
          uploader={{name: targetCommentUploaderName, id: targetCommentUploaderId}}
        />
      }
      {!replyId && !commentId && discussionId &&
        <Content
          comments={targetContentComments}
          content={discussionDescription}
          contentAvailable={!!discussionTitle}
          discussionId={discussionId}
          isDiscussion
          panelId={id}
          rootId={rootId}
          rootType={rootType}
          title={cleanString(discussionTitle)}
        />
      }
    </div>
  )
}
