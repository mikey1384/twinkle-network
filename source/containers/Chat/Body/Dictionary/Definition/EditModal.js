import React, { useEffect, useMemo, useState } from 'react';
import Button from 'components/Button';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import PartOfSpeechBlock from './PartOfSpeechBlock';
import PartOfSpeechesList from './PartOfSpeechesList';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { isMobile } from 'helpers';

EditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  partOfSpeeches: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;

export default function EditModal({ onHide, onSubmit, partOfSpeeches, word }) {
  const [adjectiveIds, setAdjectiveIds] = useState([]);
  const [adverbIds, setAdverbIds] = useState([]);
  const [conjunctionIds, setConjunctionIds] = useState([]);
  const [interjectionIds, setInterjectionIds] = useState([]);
  const [nounIds, setNounIds] = useState([]);
  const [prepositionIds, setPrepositionIds] = useState([]);
  const [pronounIds, setPronounIds] = useState([]);
  const [verbIds, setVerbIds] = useState([]);
  const [otherIds, setOtherIds] = useState([]);
  const posObj = useMemo(() => {
    const result = {
      adjectives: {},
      adverbs: {},
      conjunctions: {},
      interjections: {},
      nouns: {},
      prepositions: {},
      pronouns: {},
      verbs: {},
      others: {}
    };
    for (let key in partOfSpeeches) {
      for (let partOfSpeech of partOfSpeeches[key]) {
        result[key][partOfSpeech.id] = {
          id: partOfSpeech.id,
          title: partOfSpeech.definition
        };
      }
    }
    return result;
  }, [partOfSpeeches]);

  useEffect(() => {
    setAdjectiveIds(partOfSpeeches.adjectives.map(({ id }) => id));
  }, [partOfSpeeches.adjectives]);

  useEffect(() => {
    setAdverbIds(partOfSpeeches.adverbs.map(({ id }) => id));
  }, [partOfSpeeches.adverbs]);

  useEffect(() => {
    setConjunctionIds(partOfSpeeches.conjunctions.map(({ id }) => id));
  }, [partOfSpeeches.conjunctions]);

  useEffect(() => {
    setInterjectionIds(partOfSpeeches.interjections.map(({ id }) => id));
  }, [partOfSpeeches.interjections]);

  useEffect(() => {
    setNounIds(partOfSpeeches.nouns.map(({ id }) => id));
  }, [partOfSpeeches.nouns]);

  useEffect(() => {
    setPrepositionIds(partOfSpeeches.prepositions.map(({ id }) => id));
  }, [partOfSpeeches.prepositions]);

  useEffect(() => {
    setPronounIds(partOfSpeeches.pronouns.map(({ id }) => id));
  }, [partOfSpeeches.pronouns]);

  useEffect(() => {
    setVerbIds(partOfSpeeches.verbs.map(({ id }) => id));
  }, [partOfSpeeches.verbs]);

  useEffect(() => {
    setOtherIds(partOfSpeeches.others.map(({ id }) => id));
  }, [partOfSpeeches.others]);

  return (
    <DndProvider backend={Backend}>
      <Modal large onHide={onHide}>
        <header>{`Edit Definitions of "${word}"`}</header>
        <main>
          <div style={{ display: 'flex', width: '100%' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', width: '60%' }}
            >
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Adjective"
                posIds={adjectiveIds}
                posObject={posObj.adjectives}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setAdjectiveIds,
                    ids: adjectiveIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Adverb"
                posIds={adverbIds}
                posObject={posObj.adverbs}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setAdverbIds,
                    ids: adverbIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Conjunction"
                posIds={conjunctionIds}
                posObject={posObj.conjunctions}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setConjunctionIds,
                    ids: conjunctionIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Interjection"
                posIds={interjectionIds}
                posObject={posObj.interjections}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setInterjectionIds,
                    ids: interjectionIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Noun"
                posIds={nounIds}
                posObject={posObj.nouns}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setNounIds,
                    ids: nounIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Preposition"
                posIds={prepositionIds}
                posObject={posObj.prepositions}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setPrepositionIds,
                    ids: prepositionIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Pronoun"
                posIds={pronounIds}
                posObject={posObj.pronouns}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setPronounIds,
                    ids: pronounIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Verb"
                posIds={verbIds}
                posObject={posObj.verbs}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setVerbIds,
                    ids: verbIds
                  })
                }
              />
              <PartOfSpeechBlock
                style={{ marginBottom: '1.5rem' }}
                type="Other"
                posIds={otherIds}
                posObject={posObj.others}
                onListItemMove={params =>
                  handleItemsMove({
                    ...params,
                    setIds: setOtherIds,
                    ids: otherIds
                  })
                }
              />
            </div>
            <div style={{ width: '40%' }}>
              <PartOfSpeechesList />
            </div>
          </div>
        </main>
        <footer>
          <Button
            transparent
            style={{ marginRight: '0.7rem' }}
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button color="blue" onClick={onSubmit}>
            Done
          </Button>
        </footer>
      </Modal>
    </DndProvider>
  );

  function handleItemsMove({ sourceId, targetId, ids, setIds }) {
    const newIds = [...ids];
    const sourceIndex = newIds.indexOf(sourceId);
    const targetIndex = newIds.indexOf(targetId);
    newIds.splice(sourceIndex, 1);
    newIds.splice(targetIndex, 0, sourceId);
    setIds(newIds);
  }
}
