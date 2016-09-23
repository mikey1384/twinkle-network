import React from 'react';
import UserLink from '../UserLink';
import ContentLink from '../ContentLink';
import {timeSince} from 'helpers/timeStampHelpers';

export default function Heading({
  videoTitle,
  action,
  uploader,
  siblingContentUploader,
  parentContent,
  timeStamp
}) {
  const siblingAction = !!siblingContentUploader ?
  <span><UserLink user={siblingContentUploader} />'s comment on</span> : '';

  return (
    <div className="panel-heading">
      <UserLink user={uploader} /> {action} {siblingAction} video: "<ContentLink content={parentContent}/>" ({timeSince(timeStamp)})
    </div>
  )
}
