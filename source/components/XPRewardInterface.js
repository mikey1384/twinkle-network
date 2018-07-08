import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'components/Texts/Textarea'
import { Color } from 'constants/css'
import { css } from 'emotion'
import {
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty
} from 'helpers/stringHelpers'
import Button from 'components/Button'
import request from 'axios'
import { auth } from 'helpers/apiHelpers'
import { URL } from 'constants/URL'
import { connect } from 'react-redux'

class XPRewardInterface extends Component {
  static propTypes = {
    contentType: PropTypes.string.isRequired,
    contentId: PropTypes.number.isRequired,
    stars: PropTypes.array,
    uploaderId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired
  }

  state = {
    rewardExplanation: '',
    twoStarSelected: false,
    rewarding: false
  }

  render() {
    const { rewarding, rewardExplanation, twoStarSelected } = this.state
    const { contentType, stars = [], userId } = this.props
    if (!userId) return null
    const totalStars =
      stars.length > 0
        ? stars.reduce((prev, star) => prev + star.rewardAmount, 0)
        : 0
    const prevRewardedStars = stars.reduce((prev, star) => {
      if (star.rewarderId === userId) {
        return prev + star.rewardAmount
      }
      return prev
    }, 0)
    const canRewardTwoStars = 5 - totalStars >= 2 && prevRewardedStars === 0
    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          padding: 1rem;
          font-size: 1.6rem;
          align-items: center;
          color: ${Color.pink()};
        `}
      >
        <section
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <Button
            logo
            style={{ display: 'flex' }}
            filled={!twoStarSelected}
            onClick={() => this.setState({ twoStarSelected: false })}
          >
            <span className="glyphicon glyphicon-star" />
            &nbsp;Reward a star{canRewardTwoStars ? ' (Great - 200 XP)' : ''}
          </Button>
          {canRewardTwoStars && (
            <Button
              gold
              style={{ display: 'flex', marginTop: '1rem' }}
              filled={twoStarSelected}
              onClick={() => this.setState({ twoStarSelected: true })}
            >
              <span className="glyphicon glyphicon-star" />
              <span className="glyphicon glyphicon-star" />
              &nbsp;Reward 2 stars (Excellent - 400 XP)
            </Button>
          )}
        </section>
        <Textarea
          autoFocus
          className={css`
            margin-top: 1rem;
          `}
          minRows={3}
          value={rewardExplanation}
          onChange={event =>
            this.setState({ rewardExplanation: addEmoji(event.target.value) })
          }
          placeholder={`Let the recipient know why you are rewarding XP for this ${
            contentType === 'url' ? 'link' : contentType
          } (optional)`}
          style={exceedsCharLimit({
            contentType: 'rewardComment',
            text: rewardExplanation
          })}
        />
        <section
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          <Button
            love
            filled
            disabled={
              exceedsCharLimit({
                contentType: 'rewardComment',
                text: rewardExplanation
              }) || rewarding
            }
            onClick={this.onRewardSubmit}
          >
            Confirm
          </Button>
        </section>
      </div>
    )
  }

  onRewardSubmit = async() => {
    const { rewardExplanation, twoStarSelected } = this.state
    const { contentType, contentId, onRewardSubmit, uploaderId } = this.props
    try {
      this.setState({ rewarding: true })
      const { data } = await request.post(
        `${URL}/user/reward`,
        {
          rewardExplanation: finalizeEmoji(
            stringIsEmpty(rewardExplanation) ? '' : rewardExplanation
          ),
          twoStarSelected,
          contentType,
          contentId,
          uploaderId
        },
        auth()
      )
      onRewardSubmit(data)
    } catch (error) {
      console.error({ error })
    }
  }
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(XPRewardInterface)
