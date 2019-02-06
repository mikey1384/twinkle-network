import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import { Color } from 'constants/css';
import { css } from 'emotion';
import {
  addCommasToNumber,
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty
} from 'helpers/stringHelpers';
import FilterBar from 'components/FilterBar';
import Button from 'components/Button';
import request from 'axios';
import Icon from 'components/Icon';
import { returnMaxStars } from 'constants/defaultValues';
import { auth } from 'helpers/requestHelpers';
import { connect } from 'react-redux';
import URL from 'constants/URL';

class XPRewardInterface extends Component {
  static propTypes = {
    contentType: PropTypes.string.isRequired,
    contentId: PropTypes.number.isRequired,
    difficulty: PropTypes.number,
    stars: PropTypes.array,
    uploaderId: PropTypes.number.isRequired,
    userId: PropTypes.number,
    noPadding: PropTypes.bool,
    onRewardSubmit: PropTypes.func.isRequired
  };

  state = {
    rewardExplanation: '',
    rewarding: false,
    selectedAmount: 0,
    twinkleTabActive: true
  };

  componentDidUpdate(prevProps) {
    const { difficulty } = this.props;
    if (prevProps.difficulty !== difficulty) {
      this.setState({ selectedAmount: 0 });
    }
  }

  render() {
    const {
      rewarding,
      rewardExplanation,
      selectedAmount,
      twinkleTabActive
    } = this.state;
    const {
      contentType,
      difficulty,
      noPadding,
      uploaderId,
      userId
    } = this.props;
    if (!userId || uploaderId === userId) return null;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: noPadding ? '1rem 0 0 0' : '1rem',
          fontSize: '1.6rem',
          alignItems: 'center',
          color: Color.blue()
        }}
      >
        <FilterBar style={{ background: 'none' }}>
          <nav
            className={twinkleTabActive ? 'active' : ''}
            onClick={() =>
              this.setState(state => ({
                selectedAmount: state.twinkleTabActive
                  ? state.selectedAmount
                  : 0,
                twinkleTabActive: true
              }))
            }
          >
            Reward Twinkles
          </nav>
          <nav
            className={!twinkleTabActive ? 'active' : ''}
            onClick={() =>
              this.setState(state => ({
                selectedAmount: !state.twinkleTabActive
                  ? state.selectedAmount
                  : 0,
                twinkleTabActive: false
              }))
            }
          >
            Reward Stars
          </nav>
        </FilterBar>
        <section
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          {this.renderButtons({
            maxStars: returnMaxStars({ difficulty }),
            selectedAmount,
            twinkleTabActive
          })}
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
              }) ||
              rewarding ||
              selectedAmount === 0
            }
            onClick={this.onRewardSubmit}
          >
            Confirm
          </Button>
        </section>
      </div>
    );
  }

  renderButtons = ({ maxStars, selectedAmount, twinkleTabActive }) => {
    const { stars = [], userId } = this.props;
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
    const maxRewardableStars = Math.ceil(maxStars / 2);
    const myRewardableStars = maxRewardableStars - prevRewardedStars;
    const remainingStars = maxStars - currentStars;
    const multiplier = twinkleTabActive ? 1 : 5;
    const buttons = [];
    for (
      let i = 1;
      i * multiplier <=
      Math.min(remainingStars, myRewardableStars, twinkleTabActive ? 4 : 25);
      i++
    ) {
      buttons.push(
        <Button
          key={i * multiplier}
          info={
            !(i === maxRewardableStars && maxRewardableStars < 5) &&
            i * multiplier < 5
          }
          warning={i * multiplier >= 5 && i * multiplier < 25}
          gold={
            (i === maxRewardableStars && maxRewardableStars < 5) ||
            i * multiplier >= 25
          }
          style={{
            justifyContent: 'flex-start',
            marginTop: i !== 1 && '0.5rem'
          }}
          onClick={() => this.setState({ selectedAmount: i * multiplier })}
          filled={selectedAmount === i * multiplier}
        >
          {this.renderStars({ numStars: i, twinkleTabActive })}
          <span style={{ marginLeft: '0.7rem' }}>
            Reward {i * multiplier === 1 ? 'a' : i * multiplier} Twinkle
            {i * multiplier > 1 ? 's' : ''} (
            {addCommasToNumber(i * multiplier * 200)} XP)
          </span>
        </Button>
      );
    }
    if (twinkleTabActive && Math.min(remainingStars, myRewardableStars) >= 5) {
      buttons.push(
        <Button
          warning
          key={5}
          onClick={() => this.setState({ twinkleTabActive: false })}
          style={{
            justifyContent: 'flex-start',
            marginTop: '0.5rem'
          }}
        >
          <Icon icon="star" />
          <span style={{ marginLeft: '0.7rem' }}>
            Reward Stars (×5 Twinkles)
          </span>
        </Button>
      );
    }
    return buttons.length > 0 ? (
      buttons
    ) : (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem 0 2rem 0',
          fontWeight: 'bold'
        }}
      >
        Cannot reward more than {Math.min(remainingStars, myRewardableStars)}{' '}
        Twinkle
        {Math.min(remainingStars, myRewardableStars) > 1 ? 's' : ''}
      </div>
    );
  };

  renderStars = ({ numStars, twinkleTabActive }) => {
    const result = [];
    for (let i = 0; i < numStars; i++) {
      result.push(
        <Icon
          key={i}
          icon={twinkleTabActive ? 'certificate' : 'star'}
          style={{ marginLeft: i !== 0 && '0.2rem' }}
        />
      );
    }
    return result;
  };

  onRewardSubmit = async() => {
    const { rewardExplanation, selectedAmount } = this.state;
    const { contentType, contentId, onRewardSubmit, uploaderId } = this.props;
    try {
      this.setState({ rewarding: true });
      const { data } = await request.post(
        `${URL}/user/reward`,
        {
          rewardExplanation: finalizeEmoji(
            stringIsEmpty(rewardExplanation) ? '' : rewardExplanation
          ),
          amount: selectedAmount,
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
