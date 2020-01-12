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
    color: 'logoBlue'
  },
  2: {
    label: 'elementary',
    rewardAmount: 200,
    color: 'pink'
  },
  3: {
    label: 'intermediate',
    rewardAmount: 500,
    color: 'orange'
  },
  4: {
    label: 'advanced',
    rewardAmount: 5000,
    color: 'red'
  },
  5: {
    label: 'epic',
    rewardAmount: 10000,
    color: 'gold'
  }
};

export default function WordRegisterStatus() {
  const {
    state: { wordRegisterStatus: { frequency, content } = {} }
  } = useChatContext();

  const wordLevel = useMemo(() => {
    if (frequency > 3.7) {
      if (content.length < 7) return 1;
      return 2;
    }
    if (frequency > 2) return 3;
    if (frequency > 1.4) return 4;
    return 5;
  }, [content.length, frequency]);

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
          fontSize: '2.1rem',
          color: '#fff',
          background: Color.black()
        }}
      >
        <b style={{ color: Color[rewardHash[wordLevel].color]() }}>{content}</b>{' '}
        {`is `}
        {wordLevel === 1 ? 'a' : 'an'}{' '}
        <b style={{ color: Color[rewardHash[wordLevel].color]() }}>
          {rewardHash[wordLevel].label}
        </b>{' '}
        word. You earned{' '}
        <b style={{ color: Color[rewardHash[wordLevel].color]() }}>
          {addCommasToNumber(rewardHash[wordLevel].rewardAmount)} XP
        </b>
      </div>
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
