import React, { useMemo } from 'react';
import { useChatContext } from 'contexts';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { returnWordLevel } from 'helpers';
import { rewardHash } from 'constants/defaultValues';
import Button from 'components/Button';
import Icon from 'components/Icon';

export default function WordRegisterStatus() {
  const {
    state: { wordRegisterStatus: { frequency, content } = {} }
  } = useChatContext();

  const wordLevel = useMemo(() => {
    return returnWordLevel({ frequency, wordLength: content.length });
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
          justifyContent: 'center',
          background: Color.targetGray()
        }}
      >
        <Button color="orange" style={{ marginRight: '1rem' }} skeuomorphic>
          <Icon icon="star" />
          <span style={{ marginLeft: '0.7rem' }}>Tap here for Bonus XP</span>
        </Button>
        <Button skeuomorphic>
          <Icon icon="pencil-alt" />
          <span style={{ marginLeft: '0.7rem' }}>{`Edit "${content}"`}</span>
        </Button>
      </div>
    </div>
  );
}
