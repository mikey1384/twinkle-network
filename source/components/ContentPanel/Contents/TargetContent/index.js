import React from 'react'
import PropTypes from 'prop-types'
import Content from './Content'
import { cleanString } from 'helpers/stringHelpers'

TargetContent.propTypes = {
  methods: PropTypes.object.isRequired,
  myId: PropTypes.number,
  contentObj: PropTypes.object.isRequired
}
export default function TargetContent({
  myId,
  methods,
  contentObj: {
    commentId,
    discussionId,
    discussionDescription,
    discussionTimeStamp,
    discussionTitle,
    discussionUploaderAuth,
    discussionUploaderId,
    discussionUploaderName,
    id,
    replyId,
    rootContent,
    rootId,
    rootType,
    targetComment,
    targetCommentStars,
    targetCommentTimeStamp,
    targetCommentUploaderAuth,
    targetCommentUploaderId,
    targetCommentUploaderName,
    targetContentComments = [],
    targetContentLikers,
    targetReply,
    targetReplyTimeStamp,
    targetReplyUploaderAuth,
    targetReplyUploaderName,
    targetReplyUploaderId,
    timeStamp
  }
}) {
  const replyToReply = {
    type: 'comment',
    replyId,
    content: targetReply,
    contentAvailable: !!targetReply,
    timeStamp: targetReplyTimeStamp,
    uploader: {
      name: targetReplyUploaderName,
      id: targetReplyUploaderId,
      authLevel: targetReplyUploaderAuth
    }
  }
  const replyToComment = {
    type: 'comment',
    content: targetComment,
    contentAvailable: !!targetComment,
    timeStamp: targetCommentTimeStamp,
    uploader: {
      name: targetCommentUploaderName,
      id: targetCommentUploaderId,
      authLevel: targetCommentUploaderAuth
    }
  }
  const discussion = {
    content: discussionDescription,
    contentAvailable: !!discussionTitle,
    isDiscussion: true,
    timeStamp: discussionTimeStamp,
    title: cleanString(discussionTitle),
    uploader: {
      name: discussionUploaderName,
      id: discussionUploaderId,
      authLevel: discussionUploaderAuth
    }
  }
  const content = {
    commentId,
    comments: targetContentComments,
    discussionId,
    likes: targetContentLikers,
    methods,
    myId,
    rootContent,
    rootId,
    rootType,
    stars: targetCommentStars,
    panelId: id,
    ...(replyId
      ? replyToReply
      : commentId
        ? replyToComment
        : discussionId
          ? discussion
          : {})
  }
  return (
    <div style={{ fontSize: '1.5rem' }}>
      <Content {...content} />
    </div>
  )
}
