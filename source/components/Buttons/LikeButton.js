import PropTypes from 'prop-types';
import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { likeContent } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

LikeButton.propTypes = {
  className: PropTypes.string,
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  liked: PropTypes.bool.isRequired,
  filled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  targetLabel: PropTypes.string
};

function LikeButton({
  className,
  contentId,
  contentType,
  dispatch,
  filled,
  style,
  liked,
  onClick,
  targetLabel
}) {
  return (
    <ErrorBoundary>
      <Button
        className={className}
        color={(filled && liked) || !filled ? 'logoBlue' : 'lightBlue'}
        filled={filled || liked}
        style={style}
        onClick={async() => {
          try {
            const likes = await likeContent({
              id: contentId,
              type: contentType,
              dispatch
            });
            onClick(likes, contentId);
          } catch (error) {
            return console.error(error);
          }
        }}
      >
        <Icon icon="thumbs-up" />
        <span style={{ marginLeft: '0.7rem' }}>
          {liked
            ? `${targetLabel ? targetLabel + ' ' : ''}Liked!`
            : `Like${targetLabel ? ' ' + targetLabel : ''}`}
        </span>
      </Button>
    </ErrorBoundary>
  );
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(LikeButton);
