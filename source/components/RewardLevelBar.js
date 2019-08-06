import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

RewardLevelBar.propTypes = {
  className: PropTypes.string,
  rewardLevel: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default function RewardLevelBar({ className, rewardLevel, style }) {
  const stars = [];
  for (let i = 0; i < rewardLevel; i++) {
    stars.push(<Icon key={i} icon="star" style={{ marginLeft: '0.2rem' }} />);
  }
  const barColor =
    rewardLevel === 5
      ? Color.gold()
      : rewardLevel === 4
      ? Color.brownOrange()
      : rewardLevel === 3
      ? Color.orange()
      : rewardLevel === 2
      ? Color.pink()
      : Color.logoBlue();
  return (
    <div
      className={className}
      style={{
        background: barColor,
        color: '#fff',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style
      }}
    >
      <div>Reward Level: {stars}</div>
      <div>Earn up to {addCommasToNumber(rewardLevel * 2000)} XP</div>
    </div>
  );
}
