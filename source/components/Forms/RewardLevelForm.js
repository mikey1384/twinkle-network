import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';

RewardLevelForm.propTypes = {
  icon: PropTypes.string,
  rewardLevel: PropTypes.number.isRequired,
  onSetRewardLevel: PropTypes.func.isRequired,
  style: PropTypes.object,
  themed: PropTypes.bool
};

export default function RewardLevelForm({
  icon = 'star',
  themed,
  rewardLevel,
  onSetRewardLevel,
  style
}) {
  const { profileTheme } = useMyState();
  return (
    <div
      style={{
        ...style,
        background: themed ? Color[profileTheme]() : '',
        color: themed ? '#fff' : ''
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '1.5rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Icon
          key={0}
          icon={rewardLevel > 0 ? icon : ['far', icon]}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetRewardLevel(1)}
        />
        <Icon
          key={1}
          icon={rewardLevel > 1 ? icon : ['far', icon]}
          style={{ cursor: 'pointer', marginLeft: 2 }}
          onClick={() => onSetRewardLevel(2)}
        />
        <Icon
          key={2}
          icon={rewardLevel > 2 ? icon : ['far', icon]}
          style={{ cursor: 'pointer', marginLeft: 2 }}
          onClick={() => onSetRewardLevel(3)}
        />
        <Icon
          key={3}
          icon={rewardLevel > 3 ? icon : ['far', icon]}
          style={{ cursor: 'pointer', marginLeft: 2 }}
          onClick={() => onSetRewardLevel(4)}
        />
        <Icon
          key={4}
          icon={rewardLevel > 4 ? icon : ['far', icon]}
          style={{ cursor: 'pointer', marginLeft: 2 }}
          onClick={() => onSetRewardLevel(5)}
        />
      </div>
      <a
        style={{
          color: themed ? '#fff' : '',
          cursor: 'pointer',
          fontSize: '1.5rem',
          userSelect: 'none'
        }}
        onClick={() => onSetRewardLevel(0)}
      >
        Clear
      </a>
    </div>
  );
}
