import React from 'react';
import UserLink from '../UserLink';
import ContentLink from '../ContentLink';
import {timeSince} from 'helpers/timeStampHelpers';

export default function Heading({
  type,
  videoTitle,
  action,
  content,
  uploader,
  targetReplyUploader,
  targetCommentUploader,
  parentContent,
  timeStamp
}) {
  let targetAction;

  if (!!targetReplyUploader) {
    targetAction = <span><UserLink user={targetReplyUploader} />'s reply on</span>
  }
  else if (!!targetCommentUploader) {
    targetAction = <span><UserLink user={targetCommentUploader} />'s comment on</span>
  }

  switch (type) {
    case 'video':
      return <div className="panel-heading">
        <UserLink user={uploader} /> uploaded a video: <ContentLink content={parentContent}/> {`${!!timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}
      </div>
    case 'comment':
      return <div className="panel-heading">
        <UserLink user={uploader} /> {action} {targetAction} video: <ContentLink content={parentContent}/> ({timeSince(timeStamp)})
      </div>
    case 'url':
    return <div className="panel-heading">
        <UserLink user={uploader} /> shared a link: <a href={content} target="_blank"><strong>{parentContent.title}</strong></a> {`${!!timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}
      </div>
    default:
      return <div className="panel-heading">Error</div>
  }
}
