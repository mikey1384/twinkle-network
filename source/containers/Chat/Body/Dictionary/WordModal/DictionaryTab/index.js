import React from 'react';
import PropTypes from 'prop-types';
import PosBlock from './PosBlock';
import Button from 'components/Button';

DictionaryTab.propTypes = {
  definitionIds: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired,
  posObj: PropTypes.object.isRequired,
  posOrder: PropTypes.array.isRequired,
  word: PropTypes.string.isRequired
};

export default function DictionaryTab({
  definitionIds,
  onHide,
  posObj,
  posOrder,
  word
}) {
  return (
    <>
      <main>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '3rem',
            marginBottom: '2rem',
            width: '100%'
          }}
        >
          {word}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {posOrder.map((pos, index) => (
            <PosBlock
              key={pos}
              partOfSpeech={pos}
              contentObj={posObj[pos]}
              definitionIds={definitionIds[pos]}
              style={{ marginTop: index > 0 ? '1rem' : 0 }}
            />
          ))}
        </div>
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </>
  );
}
