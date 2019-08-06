import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

RewardLevelForm.propTypes = {
  difficulty: PropTypes.number.isRequired,
  onSetDifficulty: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function RewardLevelForm({
  difficulty,
  onSetDifficulty,
  style
}) {
  return (
    <div style={style}>
      <div style={{ display: 'flex' }}>
        <Icon
          key={0}
          icon={difficulty > 0 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetDifficulty(1)}
        />
        <Icon
          key={1}
          icon={difficulty > 1 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetDifficulty(2)}
        />
        <Icon
          key={2}
          icon={difficulty > 2 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetDifficulty(3)}
        />
        <Icon
          key={3}
          icon={difficulty > 3 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetDifficulty(4)}
        />
        <Icon
          key={4}
          icon={difficulty > 4 ? 'star' : ['far', 'star']}
          style={{ cursor: 'pointer' }}
          onClick={() => onSetDifficulty(5)}
        />
      </div>
      <a
        style={{
          cursor: 'pointer',
          fontSize: '1.5rem',
          userSelect: 'none',
          marginTop: '0.5rem'
        }}
        onClick={() => onSetDifficulty(0)}
      >
        Clear
      </a>
    </div>
  );
}
