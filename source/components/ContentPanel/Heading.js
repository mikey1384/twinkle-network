import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';

Heading.propTypes = {
  action: PropTypes.string.isRequired,
  contentObj: PropTypes.shape({
    id: PropTypes.number,
    commentId: PropTypes.number,
    contentType: PropTypes.string,
    replyId: PropTypes.number,
    rootObj: PropTypes.object,
    rootId: PropTypes.number,
    rootType: PropTypes.string,
    subjectId: PropTypes.number,
    targetObj: PropTypes.object,
    timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    uploader: PropTypes.object
  }).isRequired
};

function Heading({
  action,
  contentObj,
  contentObj: {
    commentId,
    contentType,
    id,
    replyId,
    rootObj = {},
    rootType,
    targetObj = {},
    timeStamp,
    uploader = {}
  }
}) {
  return (
    <header className="heading">
      <ProfilePic
        style={{ width: '6rem', height: '6rem' }}
        userId={uploader.id}
        profilePicId={uploader.profilePicId}
      />
      <div
        style={{
          width: '90%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginLeft: '1rem'
        }}
      >
        <div
          style={{
            width: '100%'
          }}
        >
          <span className="title">{renderHeading()}</span>
          <small className="timestamp">
            {timeStamp ? `(${timeSince(timeStamp)})` : ''}
          </small>
        </div>
      </div>
    </header>
  );

  function renderHeading() {
    const contentLabel =
      rootType === 'url'
        ? 'link'
        : rootType === 'subject'
        ? 'a subject'
        : rootType;
    switch (contentType) {
      case 'video':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> uploaded a
            video:{' '}
            <ContentLink content={contentObj} contentType={contentType} />{' '}
          </>
        );
      case 'comment':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} />{' '}
            <ContentLink
              content={{ id, title: action }}
              contentType={contentType}
              style={{ color: Color.green() }}
            />
            {renderTargetAction()} {contentLabel}:{' '}
            <ContentLink content={rootObj} contentType={rootType} />{' '}
          </>
        );
      case 'url':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> shared a
            link:&nbsp;
            <ContentLink content={contentObj} contentType={contentType} />{' '}
          </>
        );
      case 'subject':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> started a{' '}
            <ContentLink
              content={{ id, title: 'subject ' }}
              contentType={contentType}
              style={{ color: Color.green() }}
            />
            {rootObj.id && (
              <>
                on {contentLabel}:{' '}
                <ContentLink content={rootObj} contentType={rootType} />{' '}
              </>
            )}
          </>
        );
      default:
        return <span>Error</span>;
    }
  }

  function renderTargetAction() {
    if (targetObj?.comment && !targetObj?.comment.notFound) {
      return (
        <span>
          {' '}
          <UsernameText
            user={targetObj.comment.uploader}
            color={Color.blue()}
          />
          {"'s "}
          <ContentLink
            content={{
              id: replyId || commentId,
              title: replyId
                ? 'reply '
                : rootType === 'user'
                ? 'message '
                : 'comment '
            }}
            contentType="comment"
            style={{ color: Color.green() }}
          />
          {!replyId && rootType === 'user' ? 'to' : 'on'}
        </span>
      );
    }
    return null;
  }
}

export default memo(Heading);
