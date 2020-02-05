import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import WordModal from '../WordModal';
import PosBlock from './PosBlock';
import { css } from 'emotion';

Definition.propTypes = {
  style: PropTypes.object,
  wordObj: PropTypes.object.isRequired
};

export default function Definition({ style, wordObj }) {
  const [wordModalShown, setWordModalShown] = useState(false);
  const {
    partOfSpeechOrder = [
      'noun',
      'verb',
      'adjective',
      'preposition',
      'adverb',
      'pronoun',
      'conjunction',
      'interjection',
      'other'
    ]
  } = wordObj;

  return (
    <div
      style={{ padding: '1rem', position: 'relative', ...style }}
      className={css`
        > section {
          > p {
            font-size: 1.7rem;
            font-style: italic;
          }
        }
      `}
    >
      {wordObj.id && (
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Button
            className={css`
              opacity: 0.8;
              &:hover {
                opacity: 1;
              }
            `}
            skeuomorphic
            onClick={() => setWordModalShown(true)}
          >
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '0.7rem' }}>Edit</span>
          </Button>
        </div>
      )}
      {partOfSpeechOrder
        .filter(pos => wordObj[pos]?.length > 0)
        .map(pos => {
          return <PosBlock key={pos} wordObj={wordObj} pos={pos} />;
        })}
      {wordModalShown && (
        <WordModal
          onHide={() => setWordModalShown(false)}
          word={wordObj.content}
        />
      )}
    </div>
  );
}
