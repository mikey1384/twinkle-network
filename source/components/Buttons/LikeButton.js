import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { useAppContext } from 'contexts';

LikeButton.propTypes = {
  className: PropTypes.string,
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  liked: PropTypes.bool.isRequired,
  filled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  targetLabel: PropTypes.string
};

export default function LikeButton({
  className,
  contentId,
  contentType,
  filled,
  style,
  liked,
  onClick,
  targetLabel
}) {
  const {
    requestHelpers: { likeContent }
  } = useAppContext();
  const [disabled, setDisabled] = useState(false);
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
              const likes = await likeContent({
                id: contentId,
                contentType
              });
              setDisabled(false);
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
    ),
    [disabled, liked]
  );
}
