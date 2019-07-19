import PropTypes from 'prop-types';
import React from 'react';
import Context from './Context';
import withContext from 'components/Wrappers/withContext';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';

Heading.propTypes = {
  action: PropTypes.string,
  contentObj: PropTypes.shape({
    id: PropTypes.number,
    commentId: PropTypes.number,
    replyId: PropTypes.number,
    rootObj: PropTypes.object,
    rootId: PropTypes.number,
    rootType: PropTypes.string,
    subjectId: PropTypes.number,
    targetObj: PropTypes.object,
    timeStamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    type: PropTypes.string,
    uploader: PropTypes.object
  }).isRequired
};

function Heading({
  action,
  contentObj,
  contentObj: {
    commentId,
    id,
    replyId,
    rootObj = {},
    rootType,
    targetObj = {},
    timeStamp,
    type,
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
    switch (type) {
      case 'video':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> uploaded a
            video: <ContentLink content={contentObj} type={type} />{' '}
          </>
        );
      case 'comment':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} />{' '}
            <ContentLink
              content={{ id, title: action }}
              type={type}
              style={{ color: Color.green() }}
            />
            {renderTargetAction()} {contentLabel}:{' '}
            <ContentLink content={rootObj} type={rootType} />{' '}
          </>
        );
      case 'url':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> shared a
            link:&nbsp;
            <ContentLink content={contentObj} type={type} />{' '}
          </>
        );
      case 'subject':
        return (
          <>
            <UsernameText user={uploader} color={Color.blue()} /> started a{' '}
            <ContentLink
              content={{ id, title: 'subject ' }}
              type={type}
              style={{ color: Color.green() }}
            />
            {rootObj.id && (
              <>
                on {contentLabel}:{' '}
                <ContentLink content={rootObj} type={rootType} />{' '}
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
            type="comment"
            style={{ color: Color.green() }}
          />
          {!replyId && rootType === 'user' ? 'to' : 'on'}
        </span>
      );
    }
    return null;
  }
}

export default withContext({ Component: Heading, Context });
