import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { connect } from 'react-redux';

RewardLevelForm.propTypes = {
  rewardLevel: PropTypes.number.isRequired,
  onSetRewardLevel: PropTypes.func.isRequired,
  style: PropTypes.object,
  profileTheme: PropTypes.string,
  themed: PropTypes.bool
};

function RewardLevelForm({
  themed,
  rewardLevel,
  onSetRewardLevel,
  profileTheme,
  style
}) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <div
      style={{
        ...style,
        background: themed ? Color[themeColor]() : '',
        color: themed ? '#fff' : ''
      }}
    >
      <div style={{ display: 'flex' }}>
        <Icon
          key={0}
          icon={rewardLevel > 0 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetRewardLevel(1)}
        />
        <Icon
          key={1}
          icon={rewardLevel > 1 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetRewardLevel(2)}
        />
        <Icon
          key={2}
          icon={rewardLevel > 2 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetRewardLevel(3)}
        />
        <Icon
          key={3}
          icon={rewardLevel > 3 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetRewardLevel(4)}
        />
        <Icon
          key={4}
          icon={rewardLevel > 4 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetRewardLevel(5)}
        />
      </div>
      <a
        style={{
          color: themed ? '#fff' : '',
          cursor: 'pointer',
          fontSize: '1.5rem',
          userSelect: 'none',
          marginTop: '0.5rem'
        }}
        onClick={() => onSetRewardLevel(0)}
      >
        Clear
      </a>
    </div>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(RewardLevelForm);