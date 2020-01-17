import React, { useMemo, useState } from 'react';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import FilterBar from 'components/FilterBar';
import BonusTab from './BonusTab';
import DictionaryTab from './DictionaryTab';
import EditTab from './EditTab';
import { DndProvider } from 'react-dnd';
import { isMobile } from 'helpers';
import { useChatContext } from 'contexts';
import { usePartOfSpeechIds } from 'helpers/hooks';

WordModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  word: PropTypes.string.isRequired
};

const Backend = isMobile(navigator) ? TouchBackend : HTML5Backend;

export default function WordModal({ onHide, word }) {
  const {
    state: { wordsObj },
    actions: { onEditWord }
  } = useChatContext();
  const [selectedTab, setSelectedTab] = useState('dictionary');
  const wordObj = useMemo(() => {
    return wordsObj[word] || {};
  }, [word, wordsObj]);
  const {
    noun = [],
    verb = [],
    adjective = [],
    preposition = [],
    adverb = [],
    pronoun = [],
    conjunction = [],
    interjection = [],
    other = [],
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
  const partOfSpeeches = useMemo(() => {
    return {
      noun,
      verb,
      adjective,
      preposition,
      adverb,
      pronoun,
      conjunction,
      interjection,
      other
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordObj]);
  const posObj = useMemo(() => {
    const result = {
      adjective: {},
      adverb: {},
      conjunction: {},
      interjection: {},
      noun: {},
      preposition: {},
      pronoun: {},
      verb: {},
      other: {}
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
  const posOrder = partOfSpeechOrder.filter(
    pos => Object.keys(posObj[pos]).length > 0
  );
  const title = useMemo(() => {
    if (selectedTab === 'edit') return `Edit Definitions of "${word}"`;
    if (selectedTab === 'bonus') return 'Win Bonus XP';
    return `Definitions of "${word}"`;
  }, [selectedTab, word]);
  const [definitionIds, setDefinitionIds] = usePartOfSpeechIds(partOfSpeeches);

  return (
    <DndProvider backend={Backend}>
      <Modal large onHide={onHide}>
        <header>{title}</header>
        <FilterBar>
          <nav
            className={selectedTab === 'dictionary' ? 'active' : ''}
            onClick={() => setSelectedTab('dictionary')}
          >
            Dictionary
          </nav>
          <nav
            className={selectedTab === 'edit' ? 'active' : ''}
            onClick={() => setSelectedTab('edit')}
          >
            Edit
          </nav>
        </FilterBar>
        {selectedTab === 'bonus' && <BonusTab word={word} onHide={onHide} />}
        {selectedTab === 'dictionary' && (
          <DictionaryTab
            definitionIds={definitionIds}
            onHide={onHide}
            posObj={posObj}
            posOrder={posOrder}
            word={word}
          />
        )}
        {selectedTab === 'edit' && (
          <EditTab
            definitionIds={definitionIds}
            onEditWord={onEditWord}
            onHide={onHide}
            originalPosOrder={posOrder}
            partOfSpeeches={partOfSpeeches}
            posObj={posObj}
            onSetDefinitionIds={setDefinitionIds}
            word={word}
          />
        )}
      </Modal>
    </DndProvider>
  );
}
