import React from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import { connect } from 'react-redux';
import { Color } from 'constants/css';
import { truncateText } from 'helpers/stringHelpers';

NotiItem.propTypes = {
  myId: PropTypes.number.isRequired,
  notification: PropTypes.object.isRequired
};

function NotiItem({
  myId,
  notification: {
    actionObj = {},
    targetComment = {},
    targetObj = {},
    targetSubject = {},
    timeStamp,
    user = {}
  }
}) {
  let notificationMessage;
  const isReply = targetComment?.userId === myId;
  const isSubjectResponse = targetSubject?.userId === myId;
  switch (actionObj.contentType) {
    case 'like':
      notificationMessage = (
        <>
          <span style={{ color: Color.lightBlue(), fontWeight: 'bold' }}>
            likes
          </span>{' '}
          <span>your</span>{' '}
          <ContentLink
            contentType={targetObj.contentType}
            content={{
              id: targetObj.id,
              title: `${
                targetObj.contentType === 'url' ? 'link' : targetObj.contentType
              } (${truncateText({ text: targetObj.content, limit: 100 })})`
            }}
          />
        </>
      );
      break;
    case 'reward':
      notificationMessage = (
        <>
          <span
            style={{
              color:
                actionObj.amount === 25
                  ? Color.gold()
                  : actionObj.amount >= 10
                  ? Color.rose()
                  : actionObj.amount >= 5
                  ? Color.orange()
                  : actionObj.amount >= 3
                  ? Color.pink()
                  : Color.lightBlue(),
              fontWeight: 'bold'
            }}
          >
            rewarded you {actionObj.amount === 1 ? 'a' : actionObj.amount}{' '}
            Twinkle
            {actionObj.amount > 1 ? 's' : ''}
          </span>{' '}
          for your{' '}
          <ContentLink
            contentType={targetObj.contentType}
            content={{
              id: targetObj.id,
              title: `${
                targetObj.contentType === 'url' ? 'link' : targetObj.contentType
              } (${truncateText({ text: targetObj.content, limit: 100 })})`
            }}
          />
        </>
      );
      break;
    case 'comment':
      notificationMessage = (
        <>
          <ContentLink
            contentType="comment"
            content={{
              id: actionObj.id,
              title: isReply
                ? 'replied to'
                : targetObj.contentType === 'user'
                ? 'left a message on'
                : 'commented on'
            }}
            style={{ color: Color.green() }}
          />{' '}
          your{' '}
          <ContentLink
            contentType={
              isReply
                ? 'comment'
                : isSubjectResponse
                ? 'subject'
                : targetObj.contentType
            }
            content={{
              id: isReply
                ? targetComment.id
                : isSubjectResponse
                ? targetSubject.id
                : targetObj.id,
              username: targetObj.content,
              title: `${
                isReply
                  ? 'comment'
                  : isSubjectResponse
                  ? 'subject'
                  : targetObj.contentType === 'user'
                  ? 'profile'
                  : targetObj.contentType === 'url'
                  ? 'link'
                  : targetObj.contentType
              }${
                !isReply && targetObj.contentType === 'user'
                  ? ''
                  : ` (${truncateText({
                      text: isReply
                        ? targetComment.content
                        : isSubjectResponse
                        ? targetSubject.content
                        : targetObj.content,
                      limit: 100
                    })})`
              }`
            }}
          />
          :{' '}
          <ContentLink
            contentType="comment"
            content={{
              id: actionObj.id,
              title: `"${truncateText({
                text: actionObj.content,
                limit: 100
              })}"`
            }}
            style={{ color: Color.green() }}
          />
        </>
      );
      break;
    case 'subject':
      notificationMessage = (
        <>
          <span>added a </span>
          <ContentLink
            contentType="subject"
            content={{
              id: actionObj.id,
              title: `subject (${truncateText({
                text: actionObj.content,
                limit: 100
              })})`
            }}
            style={{ color: Color.green() }}
          />{' '}
          <span>to your </span>
          <ContentLink
            contentType={targetObj.contentType}
            content={{
              id: targetObj.id,
              title: `${
                targetObj.contentType === 'url' ? 'link' : targetObj.contentType
              } (${truncateText({ text: targetObj.content, limit: 100 })})`
            }}
          />
        </>
      );
      break;
    default:
      notificationMessage = <span>There was an error - report to Mikey!</span>;
      break;
  }

  return (
    <ErrorBoundary>
      <div>
        <UsernameText user={user} color={Color.blue()} />
        &nbsp;
        {notificationMessage}
      </div>
      <small style={{ color: Color.gray() }}>{timeSince(timeStamp)}</small>
    </ErrorBoundary>
  );
}

export default connect(state => ({
  myId: state.UserReducer.userId
}))(NotiItem);
