import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useAppContext, useInputContext } from 'contexts';
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

export default function XPRewardInterface({
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
  const {
    state,
    actions: { onSetRewardForm }
  } = useInputContext();
  const rewardForm = state['reward' + contentType + contentId] || {};
  const {
    comment = '',
    selectedAmount = 0,
    starTabActive = false,
    prevRewardLevel
  } = rewardForm;
  const [rewarding, setRewarding] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    onSetRewardForm({
      contentType,
      contentId,
      form: {
        selectedAmount: rewardLevel !== prevRewardLevel ? 0 : selectedAmount,
        prevRewardLevel: rewardLevel
      }
    });
  }, [rewardLevel]);

  return useMemo(
    () =>
      userId && uploaderId !== userId ? (
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
              className={!starTabActive ? 'active' : ''}
              onClick={() => {
                onSetRewardForm({
                  contentType,
                  contentId,
                  form: {
                    selectedAmount: !starTabActive ? selectedAmount : 0,
                    starTabActive: false
                  }
                });
              }}
            >
              Reward Twinkles
            </nav>
            <nav
              className={starTabActive ? 'active' : ''}
              onClick={() => {
                onSetRewardForm({
                  contentType,
                  contentId,
                  form: {
                    selectedAmount: starTabActive ? selectedAmount : 0,
                    starTabActive: true
                  }
                });
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
              stars={stars}
              starTabActive={starTabActive}
              onSetRewardForm={form =>
                onSetRewardForm({ contentType, contentId, form })
              }
              userId={userId}
            />
          </section>
          <Textarea
            className={css`
              margin-top: 1rem;
            `}
            minRows={3}
            value={comment}
            onChange={event => {
              onSetRewardForm({
                contentType,
                contentId,
                form: {
                  comment: addEmoji(event.target.value)
                }
              });
            }}
            placeholder={`Let the recipient know why you are rewarding XP for this ${
              contentType === 'url' ? 'link' : contentType
            } (optional)`}
            style={exceedsCharLimit({
              contentType: 'rewardComment',
              text: comment
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
                  text: comment
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
      ) : null,
    [
      comment,
      contentId,
      contentType,
      userId,
      rewardLevel,
      stars,
      rewarding,
      selectedAmount,
      starTabActive
    ]
  );

  async function handleRewardSubmit() {
    try {
      setRewarding(true);
      const { data } = await request.post(
        `${URL}/user/reward`,
        {
          rewardExplanation: finalizeEmoji(
            stringIsEmpty(comment) ? '' : comment
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
        onSetRewardForm({
          contentId,
          contentType,
          form: undefined
        });
      }
    } catch (error) {
      console.error({ error });
      setRewarding(false);
    }
  }
}
