import React from 'react';
import UserLink from '../UserLink';
import ContentLink from '../ContentLink';
import {timeSince} from 'helpers/timeStampHelpers';

export default function Heading({
  type,
  videoTitle,
  action,
  uploader,
  replyContentUploader,
  siblingContentUploader,
  parentContent,
  timeStamp
}) {
  let siblingAction;

  if (!!replyContentUploader) {
    siblingAction = <span><UserLink user={replyContentUploader} />'s reply on</span>
  }
  else if (!!siblingContentUploader) {
    siblingAction = <span><UserLink user={siblingContentUploader} />'s comment on</span>
  }

  switch (type) {
    case 'video':
      return <div className="panel-heading">
        <UserLink user={uploader} /> uploaded a video: <ContentLink content={parentContent}/> {`${!!timeStamp ? '(' + timeSince(timeStamp) + ')' : ''}`}
      </div>
    case 'comment':
      return <div className="panel-heading">
        <UserLink user={uploader} /> {action} {siblingAction} video: <ContentLink content={parentContent}/> ({timeSince(timeStamp)})
      </div>
    default:
      return <div className="panel-heading">Error</div>
  }
}
