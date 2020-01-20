import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { useAppContext } from 'contexts';
import Button from 'components/Button';
import FilterBar from 'components/FilterBar';
import Rearrange from './Rearrange';
import Remove from './Remove';

EditTab.propTypes = {
  deletedDefIds: PropTypes.array.isRequired,
  editedDefinitionOrder: PropTypes.object.isRequired,
  onEditWord: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  originalDefinitionOrder: PropTypes.object.isRequired,
  originalPosOrder: PropTypes.array.isRequired,
  posObj: PropTypes.object.isRequired,
  onSetEditedDefinitionOrder: PropTypes.func.isRequired,
  word: PropTypes.string.isRequired
};

export default function EditTab({
  deletedDefIds: originalDeletedIds,
  editedDefinitionOrder,
  onEditWord,
  onHide,
  originalPosOrder,
  originalDefinitionOrder,
  posObj,
  onSetEditedDefinitionOrder,
  word
}) {
  const {
    requestHelpers: { editWord }
  } = useAppContext();
  const [selectedTab, setSelectedTab] = useState('rearrange');
  const [posting, setPosting] = useState(false);
  const [poses, setPoses] = useState([]);
  const [deletedDefIds, setDeletedDefIds] = useState(originalDeletedIds);

  const disabled = useMemo(() => {
    let deletedDefIdsAreTheSame = false;
    let deletedDefIdsAreIncludedInTheOriginal = true;
    for (let deletedId of deletedDefIds) {
      if (!originalDeletedIds.includes(deletedId)) {
        deletedDefIdsAreIncludedInTheOriginal = false;
        break;
      }
    }
    deletedDefIdsAreTheSame =
      deletedDefIdsAreIncludedInTheOriginal &&
      deletedDefIds.length === originalDeletedIds.length;

    return (
      isEqual(originalPosOrder, poses) &&
      isEqual(originalDefinitionOrder, editedDefinitionOrder) &&
      deletedDefIdsAreTheSame
    );
  }, [
    deletedDefIds,
    editedDefinitionOrder,
    originalDefinitionOrder,
    originalDeletedIds,
    originalPosOrder,
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
            deletedDefIds={originalDeletedIds}
            editedDefinitionOrder={editedDefinitionOrder}
            onSetEditedDefinitionOrder={onSetEditedDefinitionOrder}
            onSetPoses={setPoses}
            poses={poses}
            posObj={posObj}
          />
        )}
        {selectedTab === 'remove' && (
          <Remove
            editedDefinitionOrder={editedDefinitionOrder}
            onListItemClick={handleRemoveListItemClick}
            poses={poses}
            posObj={posObj}
            deletedDefIds={deletedDefIds}
          />
        )}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Close
        </Button>
        <Button
          color="blue"
          disabled={disabled || posting}
          onClick={() => handleEditDone({ poses, editedDefinitionOrder })}
        >
          Apply
        </Button>
      </footer>
    </>
  );

  async function handleEditDone({ poses, editedDefinitionOrder }) {
    setPosting(true);
    await editWord({
      editedDefinitionOrder,
      deletedDefIds,
      partOfSpeeches: poses,
      word
    });
    onEditWord({
      deletedDefIds,
      partOfSpeeches: poses,
      editedDefinitionOrder,
      word
    });
    setPosting(false);
  }

  function handleRemoveListItemClick(defId) {
    setDeletedDefIds(defIds => {
      if (defIds.includes(defId)) {
        return defIds.filter(id => id !== defId);
      } else {
        return [...defIds, defId];
      }
    });
  }
}
