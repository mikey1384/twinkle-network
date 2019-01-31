import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';

export default class DifficultyBar extends Component {
  static propTypes = {
    difficulty: PropTypes.number.isRequired,
    style: PropTypes.object
  };

  render() {
    const { difficulty, style } = this.props;
    const stars = [];
    for (let i = 0; i < difficulty; i++) {
      stars.push(<Icon key={i} icon="star" style={{ marginLeft: '0.2rem' }} />);
    }
    const barColor =
      difficulty === 5
        ? Color.gold()
        : difficulty === 4
        ? Color.rose()
        : difficulty === 3
        ? Color.orange()
        : difficulty === 2
        ? Color.pink()
        : Color.logoBlue();
    return (
      <div
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
        <div>Earn up to {addCommasToNumber(difficulty * 2000)} XP</div>
      </div>
    );
  }
}
