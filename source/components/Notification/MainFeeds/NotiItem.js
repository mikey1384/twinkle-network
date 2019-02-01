import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import ContentLink from 'components/ContentLink';
import { timeSince } from 'helpers/timeStampHelpers';
import { connect } from 'react-redux';
import { Color } from 'constants/css';

class NotiItem extends Component {
  static propTypes = {
    myId: PropTypes.number.isRequired,
    notification: PropTypes.object.isRequired
  };
  render() {
    const {
      myId,
      notification: {
        actionObj = {},
        targetComment = {},
        targetObj = {},
        timeStamp,
        user = {}
      }
    } = this.props;
    let notificationMessage;
    const isReply = targetComment?.userId === myId;
    switch (actionObj.type) {
      case 'like':
        notificationMessage = (
          <>
            <span>likes your </span>
            <ContentLink
              type={targetObj.type}
              content={{
                id: targetObj.id,
                title: `${
                  targetObj.type === 'url' ? 'link' : targetObj.type
                } (${targetObj.content})`
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
              type={targetObj.type}
              content={{
                id: targetObj.id,
                title: `${
                  targetObj.type === 'url' ? 'link' : targetObj.type
                } (${targetObj.content})`
              }}
            />
          </>
        );
        break;
      case 'comment':
        notificationMessage = (
          <>
            <ContentLink
              type="comment"
              content={{
                id: actionObj.id,
                title: isReply
                  ? 'replied to'
                  : targetObj.type === 'user'
                  ? 'left a message on'
                  : 'commented on'
              }}
              style={{ color: Color.green() }}
            />{' '}
            your{' '}
            <ContentLink
              type={isReply ? 'comment' : targetObj.type}
              content={{
                id: isReply ? targetComment.id : targetObj.id,
                title: `${
                  isReply
                    ? 'comment'
                    : targetObj.type === 'user'
                    ? 'profile'
                    : targetObj.type === 'url'
                    ? 'link'
                    : targetObj.type
                }${
                  !isReply && targetObj.content === 'user'
                    ? ''
                    : ` (${
                        isReply ? targetComment.content : targetObj.content
                      })`
                }`
              }}
            />
            :{' '}
            <ContentLink
              type="comment"
              content={{
                id: actionObj.id,
                title: `"${actionObj.content}"`
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
              type="subject"
              content={{
                id: actionObj.id,
                title: `subject (${actionObj.content})`
              }}
              style={{ color: Color.green() }}
            />{' '}
            <span>to your </span>
            <ContentLink
              type={targetObj.type}
              content={{
                id: targetObj.id,
                title: `${
                  targetObj.type === 'url' ? 'link' : targetObj.type
                } (${targetObj.content})`
              }}
            />
          </>
        );
        break;
      default:
        notificationMessage = (
          <span>There was an error - report to Mikey!</span>
        );
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
}

export default connect(state => ({
  myId: state.UserReducer.userId
}))(NotiItem);
