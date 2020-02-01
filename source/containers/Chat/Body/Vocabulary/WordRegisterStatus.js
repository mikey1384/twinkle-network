import React, { useMemo, useState } from 'react';
import { useChatContext } from 'contexts';
import { Color, mobileMaxWidth } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { rewardHash, returnWordLevel } from 'constants/defaultValues';
import { css } from 'emotion';
import { isMobile } from 'helpers';
import Button from 'components/Button';
import WordModal from './WordModal';

export default function WordRegisterStatus() {
  const {
    state: { wordRegisterStatus: { frequency, content } = {} }
  } = useChatContext();
  const [wordModalShown, setWordModalShown] = useState(false);

  const wordLevel = useMemo(() => {
    return returnWordLevel({
      frequency,
      word: content
    });
  }, [content, frequency]);

  return (
    <div
      style={{
        height: '16rem',
        display: 'flex',
        width: '100%',
        flexDirection: 'column'
      }}
    >
      <div
        className={css`
          padding: 1rem;
          font-size: 2rem;
          background: ${Color.darkerGray()};
          display: flex;
          align-items: center;
          height: 6rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.5rem;
          }
        `}
      >
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span style={{ color: '#fff' }}>You collected</span>
          <span> </span>
          <span
            style={{
              color: Color[rewardHash[wordLevel].color](),
              fontWeight: 'bold'
            }}
          >
            {content}
          </span>
        </div>
      </div>
      <div
        className={css`
          padding: 1rem;
          font-size: 2rem;
          color: #fff;
          background: ${Color.black()};
          display: flex;
          align-items: center;
          height: 6rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.5rem;
          }
        `}
      >
        <div>
          {!isMobile(navigator) && (
            <>
              <b style={{ color: Color[rewardHash[wordLevel].color]() }}>
                {content}
              </b>{' '}
              {`is `}
              {wordLevel === 1 ? 'a' : 'an'}{' '}
            </>
          )}
          <>
            <b style={{ color: Color[rewardHash[wordLevel].color]() }}>
              {rewardHash[wordLevel].label}
            </b>{' '}
            word.
          </>{' '}
          {isMobile(navigator) ? (
            <span>Earned </span>
          ) : (
            <span>You earned </span>
          )}
          <b style={{ color: Color[rewardHash[wordLevel].color]() }}>
            {addCommasToNumber(rewardHash[wordLevel].rewardAmount)} XP
          </b>
        </div>
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
