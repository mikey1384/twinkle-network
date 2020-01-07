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
    others = []
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
      {verbs.length > 0 && (
        <section>
          <p>verb</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {verbs.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {nouns.length > 0 && (
        <section>
          <p>noun</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {nouns.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {adjectives.length > 0 && (
        <section>
          <p>adjective</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {adjectives.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {prepositions.length > 0 && (
        <section>
          <p>preposition</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {prepositions.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {adverbs.length > 0 && (
        <section>
          <p>adverb</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {adverbs.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {pronouns.length > 0 && (
        <section>
          <p>pronoun</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {pronouns.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {conjunctions.length > 0 && (
        <section>
          <p>conjunction</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {conjunctions.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {interjections.length > 0 && (
        <section>
          <p>interjection</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {interjections.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
      )}
      {others.length > 0 && (
        <section>
          <p>other</p>
          <div
            style={{
              width: '80%',
              padding: '1rem',
              height: '100%',
              overflow: 'scroll'
            }}
          >
            {others.map(({ id, definition }, index) => (
              <div key={id}>
                {index + 1}. {definition}
              </div>
            ))}
          </div>
        </section>
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
