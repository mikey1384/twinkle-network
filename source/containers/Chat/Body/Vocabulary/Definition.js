import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import WordModal from './WordModal';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

Definition.propTypes = {
  style: PropTypes.object,
  wordObj: PropTypes.object.isRequired
};

export default function Definition({ style, wordObj }) {
  const { canEditDictionary } = useMyState();
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
    ],
    notFound
  } = wordObj;
  const [wordModalShown, setWordModalShown] = useState(false);
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
      {notFound ? (
        <div>Not Found</div>
      ) : (
        <>
          {canEditDictionary && wordObj.id && (
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
          {partOfSpeechOrder.map(pos =>
            wordObj[pos]?.length > 0 ? (
              <section key={pos}>
                <p>{pos}</p>
                <div
                  style={{
                    width: '80%',
                    padding: '1rem',
                    height: '100%',
                    overflow: 'scroll'
                  }}
                >
                  {wordObj[pos].map(({ id, definition }, index) => (
                    <div key={id}>
                      {index + 1}. {definition}
                    </div>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </>
      )}
      {wordModalShown && (
        <WordModal
          onHide={() => setWordModalShown(false)}
          word={wordObj.content}
        />
      )}
    </div>
  );
}
