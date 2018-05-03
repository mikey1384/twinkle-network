import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'
import { connect } from 'react-redux'
import Comment from './Comment'

class RewardStatus extends Component {
  static propTypes = {
    userId: PropTypes.number,
    stars: PropTypes.array
  }

  render() {
    const { stars, userId } = this.props
    if (!stars || stars.length === 0) return null
    const totalStars = stars.reduce(
      (prev, star) => (prev += star.rewardAmount),
      0
    )
    let starMarks = []
    for (let i = 0; i < totalStars; i++) {
      starMarks.push(<span key={i} className="glyphicon glyphicon-star" />)
    }
    return (
      <Fragment>
        <div
          className={css`
            font-size: 2rem;
            padding: 1rem;
            color: #fff;
            background: ${totalStars === 5 ? Color.gold() : Color.orange()};
          `}
        >
          {starMarks}
          &nbsp; This comment received {totalStars > 1
            ? totalStars
            : 'a'} Star{totalStars > 1 ? 's' : ''} ({totalStars * 200}XP)
        </div>
        {stars.map(star => <Comment key={star.id} star={star} myId={userId} />)}
      </Fragment>
    )
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(RewardStatus)
