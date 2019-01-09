import PropTypes from 'prop-types';
import React from 'react';
import UsernameText from 'components/Texts/UsernameText';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Color } from 'constants/css';

Likers.propTypes = {
  className: PropTypes.string,
  defaultText: PropTypes.string,
  likes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired
    })
  ).isRequired,
  onLinkClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  target: PropTypes.string,
  userId: PropTypes.number
};
export default function Likers({
  likes,
  target,
  userId,
  onLinkClick,
  style = {},
  className,
  defaultText
}) {
  return (
    <ErrorBoundary>
      <div style={style} className={className}>
        {renderLikers()}
      </div>
    </ErrorBoundary>
  );

  function renderLikers() {
    let userLiked = false;
    let totalLikes = 0;
    if (likes) {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].id === userId) userLiked = true;
        totalLikes++;
      }
    }
    if (userLiked) {
      totalLikes--;
      if (totalLikes > 0) {
        if (totalLikes === 1) {
          let otherLikes = likes.filter(like => like.id !== userId);
          return (
            <div>
              You and{' '}
              <UsernameText
                color={Color.blue()}
                user={{
                  id: otherLikes[0].id,
                  username: otherLikes[0].username
                }}
              />{' '}
              like {`this${target ? ' ' + target : ''}.`}
            </div>
          );
        } else {
          return (
            <div>
              You and{' '}
              <a
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => onLinkClick()}
              >
                {totalLikes} others
              </a>{' '}
              like {`this${target ? ' ' + target : ''}.`}
            </div>
          );
        }
      }
      return <div>You like {`this${target ? ' ' + target : ''}.`}</div>;
    } else if (totalLikes > 0) {
      if (totalLikes === 1) {
        return (
          <div>
            <UsernameText color={Color.blue()} user={likes[0]} /> likes{' '}
            {`this${target ? ' ' + target : ''}.`}
          </div>
        );
      } else {
        return (
          <div>
            <a
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => onLinkClick()}
            >
              {totalLikes} people
            </a>{' '}
            like {`this${target ? ' ' + target : ''}.`}
          </div>
        );
      }
    } else {
      return defaultText ? <div>{defaultText}</div> : null;
    }
  }
}
