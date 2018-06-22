import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import { Color } from 'constants/css'
import { connect } from 'react-redux'
import Comment from './Comment'

class RewardStatus extends Component {
  static propTypes = {
    userId: PropTypes.number,
    noMarginForEditButton: PropTypes.bool,
    onCommentEdit: PropTypes.func,
    stars: PropTypes.array,
    style: PropTypes.object
  }

  render() {
    const {
      noMarginForEditButton,
      onCommentEdit,
      stars,
      userId,
      style
    } = this.props
    if (!stars || stars.length === 0) return null
    const totalStars = stars.reduce((prev, star) => prev + star.rewardAmount, 0)
    let starMarks = []
    for (let i = 0; i < totalStars; i++) {
      starMarks.push(<span key={i} className="glyphicon glyphicon-star" />)
    }
    return (
      <Fragment>
        <div
          style={style}
          className={css`
            font-size: 1.6rem;
            padding: 1rem;
            color: #fff;
            background: ${totalStars === 5
              ? Color.gold()
              : Color.blue(0.6 + 0.1 * totalStars)};
          `}
        >
          {starMarks}
          &nbsp; This comment received {totalStars > 1
            ? totalStars
            : 'a'} Star{totalStars > 1 ? 's' : ''} ({totalStars * 200}XP)
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
      </Fragment>
    )
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(RewardStatus)
