import PropTypes from 'prop-types';
import React, { memo, useMemo, useState, useEffect } from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

LikeButton.propTypes = {
  className: PropTypes.string,
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  filled: PropTypes.bool,
  likes: PropTypes.array,
  onClick: PropTypes.func,
  style: PropTypes.object,
  targetLabel: PropTypes.string
};

function LikeButton({
  className,
  contentId,
  contentType,
  filled,
  likes,
  style,
  onClick = () => {},
  targetLabel
}) {
  const {
    requestHelpers: { likeContent }
  } = useAppContext();
  const {
    actions: { onLikeContent }
  } = useContentContext();
  const { userId } = useMyState();
  const [disabled, setDisabled] = useState(false);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    let userLikedThis = false;
    for (let i = 0; i < likes.length; i++) {
      if (likes[i].id === userId) userLikedThis = true;
    }
    setLiked(userLikedThis);
  }, [likes.length, userId]);
  return useMemo(
    () => (
      <ErrorBoundary>
        <Button
          disabled={disabled}
          className={className}
          color={(filled && liked) || !filled ? 'logoBlue' : 'lightBlue'}
          filled={filled || liked}
          style={style}
          onClick={async () => {
            try {
              setDisabled(true);
              const newLikes = await likeContent({
                id: contentId,
                contentType
              });
              if (userId) {
                setLiked(liked => !liked);
                onLikeContent({ likes: newLikes, contentType, contentId });
                onClick(newLikes);
              }
              setDisabled(false);
            } catch (error) {
              setDisabled(false);
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
    ),
    [disabled, liked, userId]
  );
}

export default memo(LikeButton);
