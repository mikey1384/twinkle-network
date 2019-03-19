import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { addCommasToNumber } from 'helpers/stringHelpers';

MenuButtons.propTypes = {
  maxStars: PropTypes.number.isRequired,
  selectedAmount: PropTypes.number.isRequired,
  setTwinkleTabActive: PropTypes.func.isRequired,
  setSelectedAmount: PropTypes.func.isRequired,
  stars: PropTypes.array.isRequired,
  twinkleTabActive: PropTypes.bool.isRequired,
  userId: PropTypes.number
};

export default function MenuButtons({
  maxStars,
  selectedAmount,
  setTwinkleTabActive,
  setSelectedAmount,
  stars,
  twinkleTabActive,
  userId
}) {
  let currentStars =
    stars.length > 0
      ? stars.reduce((prev, star) => prev + star.rewardAmount, 0)
      : 0;
  currentStars = Math.min(currentStars, maxStars);
  const prevRewardedStars = stars.reduce((prev, star) => {
    if (star.rewarderId === userId) {
      return prev + star.rewardAmount;
    }
    return prev;
  }, 0);
  const maxRewardableStars = Math.ceil(maxStars / 2);
  const myRewardableStars = maxRewardableStars - prevRewardedStars;
  const remainingStars = maxStars - currentStars;
  const multiplier = twinkleTabActive ? 1 : 5;
  const buttons = [];
  for (
    let i = 1;
    i * multiplier <=
    Math.min(remainingStars, myRewardableStars, twinkleTabActive ? 4 : 25);
    i++
  ) {
    buttons.push(
      <Button
        key={i * multiplier}
        color={
          !(i === maxRewardableStars && maxRewardableStars < 5) &&
          i * multiplier < 5
            ? 'lightBlue'
            : (i === maxRewardableStars && maxRewardableStars < 5) ||
              i * multiplier >= 25
            ? 'gold'
            : 'orange'
        }
        style={{
          justifyContent: 'flex-start',
          marginTop: i !== 1 && '0.5rem'
        }}
        onClick={() => setSelectedAmount(i * multiplier)}
        filled={selectedAmount === i * multiplier}
      >
        {renderStars({ numStars: i, twinkleTabActive })}
        <span style={{ marginLeft: '0.7rem' }}>
          Reward {i * multiplier === 1 ? 'a' : i * multiplier} Twinkle
          {i * multiplier > 1 ? 's' : ''} (
          {addCommasToNumber(i * multiplier * 200)} XP)
        </span>
      </Button>
    );
  }
  if (twinkleTabActive && Math.min(remainingStars, myRewardableStars) >= 5) {
    buttons.push(
      <Button
        color="orange"
        key={5}
        onClick={() => setTwinkleTabActive(false)}
        style={{
          justifyContent: 'flex-start',
          marginTop: '0.5rem'
        }}
      >
        <Icon icon="star" />
        <span style={{ marginLeft: '0.7rem' }}>Reward Stars (×5 Twinkles)</span>
      </Button>
    );
  }

  return buttons.length > 0 ? (
    buttons
  ) : (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem 0 2rem 0',
        fontWeight: 'bold'
      }}
    >
      Cannot reward more than {Math.min(remainingStars, myRewardableStars)}{' '}
      Twinkle
      {Math.min(remainingStars, myRewardableStars) > 1 ? 's' : ''}
    </div>
  );

  function renderStars({ numStars, twinkleTabActive }) {
    const result = [];
    for (let i = 0; i < numStars; i++) {
      result.push(
        <Icon
          key={i}
          icon={twinkleTabActive ? 'certificate' : 'star'}
          style={{ marginLeft: i !== 0 && '0.2rem' }}
        />
      );
    }
    return result;
  }
}
