import React, { useMemo, useState } from 'react';
import { useChatContext } from 'contexts';
import { Color } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardHash, returnWordLevel } from 'constants/defaultValues';
import Button from 'components/Button';
import WordModal from './WordModal';

export default function WordRegisterStatus() {
  const {
    state: { wordRegisterStatus: { frequency, content } = {} }
  } = useChatContext();
  const [wordModalShown, setWordModalShown] = useState(false);

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
        <span style={{ color: '#fff' }}>You collected</span>{' '}
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
        <Button skeuomorphic onClick={() => setWordModalShown(true)}>
          <span style={{ marginLeft: '0.7rem' }}>{`View "${content}"`}</span>
        </Button>
      </div>
      {wordModalShown && (
        <WordModal word={content} onHide={() => setWordModalShown(false)} />
      )}
    </div>
  );
}
