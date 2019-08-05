import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';
import { setDifficulty } from 'helpers/requestHelpers';

RewardLevelModal.propTypes = {
  contentId: PropTypes.number.isRequired,
  difficulty: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

function RewardLevelModal({
  contentId,
  dispatch,
  difficulty: initialDifficulty = 0,
  onSubmit,
  type,
  onHide
}) {
  const [disabled, setDisabled] = useState(false);
  const [difficulty, setDisplayDifficulty] = useState(initialDifficulty);
  return (
    <Modal onHide={onHide}>
      <ErrorBoundary>
        <header>
          Set Reward Level (consider both difficulty and importance)
        </header>
        <main style={{ fontSize: '3rem', paddingTop: 0 }}>
          <div style={{ marginTop: '5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex' }}>
              <Icon
                key={0}
                icon={difficulty > 0 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => setDisplayDifficulty(1)}
              />
              <Icon
                key={1}
                icon={difficulty > 1 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => setDisplayDifficulty(2)}
              />
              <Icon
                key={2}
                icon={difficulty > 2 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => setDisplayDifficulty(3)}
              />
              <Icon
                key={3}
                icon={difficulty > 3 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => setDisplayDifficulty(4)}
              />
              <Icon
                key={4}
                icon={difficulty > 4 ? 'star' : ['far', 'star']}
                style={{ cursor: 'pointer' }}
                onClick={() => setDisplayDifficulty(5)}
              />
            </div>
            <a
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                userSelect: 'none'
              }}
              onClick={() => setDisplayDifficulty(0)}
            >
              Clear
            </a>
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
          <Button disabled={disabled} color="blue" onClick={submit}>
            Set
          </Button>
        </footer>
      </ErrorBoundary>
    </Modal>
  );

  async function submit() {
    setDisabled(true);
    await setDifficulty({ contentId, type, difficulty, dispatch });
    onSubmit({ contentId, difficulty, type });
  }
}

export default connect(
  null,
  dispatch => ({
    dispatch
  })
)(RewardLevelModal);
