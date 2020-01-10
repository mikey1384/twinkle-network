import React, { useMemo } from 'react';
import { useChatContext } from 'contexts';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import Button from 'components/Button';
import Icon from 'components/Icon';

const rewardHash = {
  1: {
    label: 'basic',
    rewardAmount: 100,
    color: 'logoBlue',
    background: 'white'
  },
  2: {
    label: 'elementary',
    rewardAmount: 200,
    color: 'pink',
    background: 'white'
  },
  3: {
    label: 'intermediate',
    rewardAmount: 300,
    color: 'orange',
    background: 'white'
  },
  4: {
    label: 'advanced',
    rewardAmount: 1000,
    color: 'brownOrange',
    background: 'darkBlue'
  },
  5: {
    label: 'super advanced',
    rewardAmount: 5000,
    color: 'gold',
    background: 'white'
  },
  6: {
    label: 'epic',
    rewardAmount: 10000,
    color: 'purple',
    background: 'white'
  }
};

export default function WordRegisterStatus() {
  const {
    state: { wordRegisterStatus: { frequency = 3, content = 'instigate' } = {} }
  } = useChatContext();

  const wordLevel = useMemo(() => {
    if (frequency > 5) return 1;
    if (frequency > 4.5) return 2;
    if (frequency > 4) return 3;
    if (frequency > 2.5) return 4;
    if (frequency > 1.5) return 5;
    return 6;
  }, [frequency]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          padding: '1rem',
          fontSize: '2rem',
          background: Color.darkerGray()
        }}
      >
        <span style={{ color: '#fff' }}>You registered</span>{' '}
        <span
          style={{
            color: Color[rewardHash[wordLevel].color](),
            fontWeight: 'bold'
          }}
        >
          {content}
        </span>
      </div>
      <div
        style={{
          padding: '1rem',
          fontSize: '2rem',
          color: '#fff',
          background: Color.black()
        }}
      >
        {content} {`is an`}{' '}
        <b style={{ color: Color[rewardHash[wordLevel].color]() }}>advanced</b>{' '}
        word. You earn{' '}
        <b style={{ color: Color[rewardHash[wordLevel].color]() }}>
          {addCommasToNumber(rewardHash[wordLevel].rewardAmount)} XP
        </b>
      </div>
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        <Button style={{ marginRight: '1rem' }} skeuomorphic>
          <Icon icon="comment-alt" />
          <span style={{ marginLeft: '0.7rem' }}>Comment</span>
        </Button>
        <Button skeuomorphic>
          <Icon icon="pencil-alt" />
          <span style={{ marginLeft: '0.7rem' }}>{`Edit "${content}"`}</span>
        </Button>
      </div>
    </div>
  );
}
