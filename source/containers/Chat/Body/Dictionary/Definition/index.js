import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import EditModal from './EditModal';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

Definition.propTypes = {
  style: PropTypes.object,
  wordObj: PropTypes.object.isRequired
};

export default function Definition({ style, wordObj }) {
  const { canEditDictionary } = useMyState();
  const {
    nouns = [],
    verbs = [],
    adjectives = [],
    prepositions = [],
    adverbs = [],
    pronouns = [],
    conjunctions = [],
    interjections = [],
    others = [],
    partOfSpeechOrder
  } = wordObj;
  const [editModalShown, setEditModalShown] = useState(false);
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
      {canEditDictionary && (
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Button
            className={css`
              opacity: 0.8;
              &:hover {
                opacity: 1;
              }
            `}
            skeuomorphic
            onClick={() => setEditModalShown(true)}
          >
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '0.7rem' }}>Edit</span>
          </Button>
        </div>
      )}
      {partOfSpeechOrder.map(pos =>
        wordObj[`${pos}s`].length > 0 ? (
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
              {wordObj[`${pos}s`].map(({ id, definition }, index) => (
                <div key={id}>
                  {index + 1}. {definition}
                </div>
              ))}
            </div>
          </section>
        ) : null
      )}
      {editModalShown && (
        <EditModal
          partOfSpeeches={{
            nouns,
            verbs,
            adjectives,
            prepositions,
            adverbs,
            pronouns,
            conjunctions,
            interjections,
            others
          }}
          partOfSpeechOrder={partOfSpeechOrder}
          onHide={() => setEditModalShown(false)}
          onSubmit={handleEditDone}
          word={wordObj.content}
        />
      )}
    </div>
  );

  function handleEditDone() {
    console.log('done');
    setEditModalShown(false);
  }
}
