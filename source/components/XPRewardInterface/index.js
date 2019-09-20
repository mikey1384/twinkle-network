import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import MenuButtons from './MenuButtons';
import { Color } from 'constants/css';
import { css } from 'emotion';
import {
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty
} from 'helpers/stringHelpers';
import FilterBar from 'components/FilterBar';
import Button from 'components/Button';
import request from 'axios';
import { returnMaxStars } from 'constants/defaultValues';
import { useAppContext } from 'context';
import URL from 'constants/URL';

XPRewardInterface.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  rewardLevel: PropTypes.number,
  stars: PropTypes.array,
  uploaderId: PropTypes.number.isRequired,
  noPadding: PropTypes.bool,
  onRewardSubmit: PropTypes.func.isRequired
};

function XPRewardInterface({
  contentId,
  contentType,
  rewardLevel,
  noPadding,
  onRewardSubmit,
  stars = [],
  uploaderId
}) {
  const {
    user: {
      state: { userId }
    },
    requestHelpers: { auth }
  } = useAppContext();
  const [rewardExplanation, setRewardExplanation] = useState('');
  const [rewarding, setRewarding] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [twinkleTabActive, setTwinkleTabActive] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setSelectedAmount(0);
  }, [rewardLevel]);

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
          onClick={() => {
            setSelectedAmount(twinkleTabActive ? selectedAmount : 0);
            setTwinkleTabActive(true);
          }}
        >
          Reward Twinkles
        </nav>
        <nav
          className={!twinkleTabActive ? 'active' : ''}
          onClick={() => {
            setSelectedAmount(twinkleTabActive ? 0 : selectedAmount);
            setTwinkleTabActive(false);
          }}
        >
          Reward Stars
        </nav>
      </FilterBar>
      <section
        style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <MenuButtons
          maxStars={returnMaxStars({ rewardLevel })}
          selectedAmount={selectedAmount}
          setTwinkleTabActive={setTwinkleTabActive}
          setSelectedAmount={setSelectedAmount}
          stars={stars}
          twinkleTabActive={twinkleTabActive}
          userId={userId}
        />
      </section>
      <Textarea
        autoFocus
        className={css`
          margin-top: 1rem;
        `}
        minRows={3}
        value={rewardExplanation}
        onChange={event => {
          setRewardExplanation(addEmoji(event.target.value));
        }}
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
          color="pink"
          filled
          disabled={
            exceedsCharLimit({
              contentType: 'rewardComment',
              text: rewardExplanation
            }) ||
            rewarding ||
            selectedAmount === 0
          }
          onClick={handleRewardSubmit}
        >
          Confirm
        </Button>
      </section>
    </div>
  );

  async function handleRewardSubmit() {
    try {
      setRewarding(true);
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
      if (mounted.current) {
        setRewarding(false);
        onRewardSubmit(data);
      }
    } catch (error) {
      console.error({ error });
      setRewarding(false);
    }
  }
}
