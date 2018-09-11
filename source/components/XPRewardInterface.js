import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import { Color } from 'constants/css';
import { css } from 'emotion';
import {
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty
} from 'helpers/stringHelpers';
import Button from 'components/Button';
import request from 'axios';
import Icon from 'components/Icon';
import { returnMaxStars } from 'constants/defaultValues';
import { auth } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import { connect } from 'react-redux';

class XPRewardInterface extends Component {
  static propTypes = {
    contentType: PropTypes.string.isRequired,
    contentId: PropTypes.number.isRequired,
    stars: PropTypes.array,
    uploaderId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    noPadding: PropTypes.bool,
    type: PropTypes.string,
    rootType: PropTypes.string
  };

  state = {
    rewardExplanation: '',
    twoStarSelected: false,
    rewarding: false
  };

  render() {
    const { rewarding, rewardExplanation, twoStarSelected } = this.state;
    const {
      contentType,
      noPadding,
      stars = [],
      type,
      rootType,
      userId
    } = this.props;
    const maxStars = returnMaxStars({ type, rootType });
    if (!userId) return null;
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
    const canRewardTwoStars = 5 - currentStars >= 2 && prevRewardedStars === 0;
    return (
      <div
        className={css`
          display: flex;
          flex-direction: column;
          padding: ${noPadding ? '1rem 0 0 0' : '1rem'};
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
            style={{ justifyContent: 'flex-start' }}
            filled={!twoStarSelected}
            onClick={() => this.setState({ twoStarSelected: false })}
          >
            <Icon icon="certificate" />
            <span style={{ marginLeft: '0.7rem' }}>Reward a Twinkle</span>
          </Button>
          {canRewardTwoStars && (
            <Button
              gold
              style={{ justifyContent: 'flex-start', marginTop: '1rem' }}
              filled={twoStarSelected}
              onClick={() => this.setState({ twoStarSelected: true })}
            >
              <Icon icon="star" />
              <Icon icon="star" />
              <span style={{ marginLeft: '0.7rem' }}>
                Reward 2 stars (Excellent - 400 XP)
              </span>
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
    );
  }

  onRewardSubmit = async() => {
    const { rewardExplanation, twoStarSelected } = this.state;
    const { contentType, contentId, onRewardSubmit, uploaderId } = this.props;
    try {
      this.setState({ rewarding: true });
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
      );
      onRewardSubmit(data);
    } catch (error) {
      console.error({ error });
    }
  };
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(XPRewardInterface);
