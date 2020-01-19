import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { useAppContext } from 'contexts';
import Button from 'components/Button';
import FilterBar from 'components/FilterBar';
import Rearrange from './Rearrange';
import Remove from './Remove';

EditTab.propTypes = {
  definitionIds: PropTypes.object.isRequired,
  onEditWord: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  originalPosOrder: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired,
  onSetDefinitionIds: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditTab({
  definitionIds,
  onEditWord,
  onHide,
  partOfSpeeches,
  originalPosOrder,
  posObj,
  onSetDefinitionIds,
  word
}) {
  const {
    requestHelpers: { editWord }
  } = useAppContext();
  const [selectedTab, setSelectedTab] = useState('rearrange');
  const [posting, setPosting] = useState(false);
  const [poses, setPoses] = useState([]);

  const disabled = useMemo(() => {
    const originalIds = {
      adjective: partOfSpeeches.adjective.map(({ id }) => id),
      adverb: partOfSpeeches.adverb.map(({ id }) => id),
      conjunction: partOfSpeeches.conjunction.map(({ id }) => id),
      interjection: partOfSpeeches.interjection.map(({ id }) => id),
      noun: partOfSpeeches.noun.map(({ id }) => id),
      preposition: partOfSpeeches.preposition.map(({ id }) => id),
      pronoun: partOfSpeeches.pronoun.map(({ id }) => id),
      verb: partOfSpeeches.verb.map(({ id }) => id),
      other: partOfSpeeches.other.map(({ id }) => id)
    };
    return (
      isEqual(originalPosOrder, poses) && isEqual(originalIds, definitionIds)
    );
  }, [
    definitionIds,
    originalPosOrder,
    partOfSpeeches.adjective,
    partOfSpeeches.adverb,
    partOfSpeeches.conjunction,
    partOfSpeeches.interjection,
    partOfSpeeches.noun,
    partOfSpeeches.other,
    partOfSpeeches.preposition,
    partOfSpeeches.pronoun,
    partOfSpeeches.verb,
    poses
  ]);

  useEffect(() => {
    setPoses(originalPosOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '3rem',
            width: '100%'
          }}
        >
          {`Edit Definitions of "${word}"`}
        </p>
        <FilterBar style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
          <nav
            className={selectedTab === 'rearrange' ? 'active' : ''}
            onClick={() => setSelectedTab('rearrange')}
          >
            Rearrange
          </nav>
          <nav
            className={selectedTab === 'remove' ? 'active' : ''}
            onClick={() => setSelectedTab('remove')}
          >
            Remove
          </nav>
        </FilterBar>
        {selectedTab === 'rearrange' && (
          <Rearrange
            definitionIds={definitionIds}
            onSetDefinitionIds={onSetDefinitionIds}
            onSetPoses={setPoses}
            poses={poses}
            posObj={posObj}
          />
        )}
        {selectedTab === 'remove' && (
          <Remove definitionIds={definitionIds} poses={poses} posObj={posObj} />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Close
        </Button>
        <Button
          color="blue"
          disabled={disabled || posting}
          onClick={() => handleEditDone({ poses, definitionIds })}
        >
          Apply
        </Button>
      </footer>
    </>
  );

  async function handleEditDone({ poses, definitionIds }) {
    setPosting(true);
    const definitions = [];
    for (let key in posObj) {
      for (let id of definitionIds[key]) {
        const definition = posObj[key][id].title;
        definitions.push({ definition, partOfSpeech: key });
      }
    }
    await editWord({
      partOfSpeeches: poses,
      definitions,
      word
    });
    onEditWord({
      partOfSpeeches: poses,
      definitions,
      word
    });
    setPosting(false);
  }
}
