import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';
import { connect } from 'react-redux';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { returnMaxStars } from 'constants/defaultValues';
import Comment from './Comment';
import Starmarks from './Starmarks';

class RewardStatus extends Component {
  static propTypes = {
    difficulty: PropTypes.number,
    userId: PropTypes.number,
    noMarginForEditButton: PropTypes.bool,
    onCommentEdit: PropTypes.func,
    stars: PropTypes.array,
    style: PropTypes.object
  };

  render() {
    const {
      difficulty,
      noMarginForEditButton,
      onCommentEdit,
      stars,
      userId,
      style
    } = this.props;
    const maxStars = returnMaxStars({ difficulty });
    let rewardedStars = stars.reduce(
      (prev, star) => prev + star.rewardAmount,
      0
    );
    rewardedStars = Math.min(rewardedStars, maxStars);
    if (!stars || stars.length === 0) return null;
    return (
      <>
        <div
          style={style}
          className={css`
            font-size: 1.6rem;
            padding: 0.4rem 1rem 0.2rem 1rem;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: ${rewardedStars === maxStars
              ? Color.gold()
              : rewardedStars > 10
                ? Color.orange(0.5 + 0.01 * rewardedStars)
                : Color.blue(
                    0.5 + (1 / Math.min(20, maxStars * 2)) * rewardedStars
                  )};
          `}
        >
          <Starmarks stars={rewardedStars} />
          <div style={{ fontSize: '1.3rem' }}>
            {rewardedStars} Twinkle
            {rewardedStars > 1 ? 's' : ''} rewarded ({rewardedStars} × 200 XP ={' '}
            {addCommasToNumber(rewardedStars * 200)} XP | max {maxStars} Twinkle
            {maxStars > 1 ? 's' : ''})
          </div>
        </div>
        {stars.map(star => (
          <Comment
            noMarginForEditButton={noMarginForEditButton}
            key={star.id}
            star={star}
            myId={userId}
            onEditDone={onCommentEdit}
          />
        ))}
      </>
    );
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(RewardStatus);
