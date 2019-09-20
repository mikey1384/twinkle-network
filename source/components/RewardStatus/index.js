import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { addCommasToNumber, stringIsEmpty } from 'helpers/stringHelpers';
import { returnMaxStars } from 'constants/defaultValues';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Comment from './Comment';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Starmarks from './Starmarks';
import { useAppContext } from 'context';

RewardStatus.propTypes = {
  className: PropTypes.string,
  rewardLevel: PropTypes.number,
  noMarginForEditButton: PropTypes.bool,
  onCommentEdit: PropTypes.func,
  stars: PropTypes.array,
  style: PropTypes.object
};

function RewardStatus({
  className,
  rewardLevel,
  noMarginForEditButton,
  onCommentEdit,
  stars = [],
  style
}) {
  const {
    user: {
      state: { userId }
    }
  } = useAppContext();
  const [loaded, setLoaded] = useState(2);
  const finalStar = stars.length > 0 ? stars[stars.length - 1] : {};
  const starsWithComment = stars.filter(
    star => !stringIsEmpty(star.rewardComment) && star.id !== finalStar.id
  );
  const starsWithoutComment = stars.filter(
    star => stringIsEmpty(star.rewardComment) && star.id !== finalStar.id
  );
  stars = starsWithoutComment
    .concat(starsWithComment)
    .concat(finalStar.id ? [finalStar] : []);
  const maxStars = returnMaxStars({ rewardLevel });
  let rewardedStars = stars.reduce((prev, star) => prev + star.rewardAmount, 0);
  rewardedStars = Math.min(rewardedStars, maxStars);
  if (!stars || stars.length === 0) return null;

  return (
    <ErrorBoundary>
      <div
        style={style}
        className={`${className} ${css`
          font-size: 1.6rem;
          padding: 0.4rem 1rem 0.2rem 1rem;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: ${rewardedStars === maxStars
            ? Color.gold()
            : rewardedStars >= 25
            ? Color.brownOrange()
            : Color.logoBlue()};
        `}`}
      >
        <Starmarks stars={rewardedStars} />
        <div style={{ fontSize: '1.5rem' }}>
          {rewardedStars} Twinkle
          {rewardedStars > 1 ? 's' : ''} (
          {addCommasToNumber(rewardedStars * 200)} XP) rewarded out of max{' '}
          {maxStars}
        </div>
      </div>
      {loaded < stars.length && (
        <LoadMoreButton
          color={
            rewardedStars === maxStars || rewardedStars > 10
              ? 'orange'
              : 'lightBlue'
          }
          label="Show More Reward Records"
          filled
          style={{
            fontSize: '1.3rem',
            marginTop: '1rem'
          }}
          onClick={() => setLoaded(loaded + 3)}
        />
      )}
      {stars
        .filter((star, index) => index > stars.length - loaded - 1)
        .map(star => (
          <Comment
            maxRewardableStars={Math.ceil(maxStars / 2)}
            noMarginForEditButton={noMarginForEditButton}
            key={star.id}
            star={star}
            myId={userId}
            onEditDone={onCommentEdit}
          />
        ))}
    </ErrorBoundary>
  );
}
