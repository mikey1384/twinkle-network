import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import { useAppContext } from 'contexts';

RewardLevelModal.propTypes = {
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  rewardLevel: PropTypes.number,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default function RewardLevelModal({
  contentId,
  contentType,
  rewardLevel: initialRewardLevel = 0,
  onSubmit,
  onHide
}) {
  const {
    requestHelpers: { updateRewardLevel }
  } = useAppContext();
  const [disabled, setDisabled] = useState(false);
  const [rewardLevel, setRewardLevel] = useState(initialRewardLevel);
  return (
    <Modal onHide={onHide}>
      <ErrorBoundary>
        <header>
          Set Reward Level (consider both difficulty and importance)
        </header>
        <main style={{ fontSize: '3rem', paddingTop: 0 }}>
          <RewardLevelForm
            rewardLevel={rewardLevel}
            onSetRewardLevel={setRewardLevel}
            style={{ marginTop: '5rem', textAlign: 'center' }}
          />
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
    await updateRewardLevel({ contentId, contentType, rewardLevel });
    onSubmit({ contentId, rewardLevel, contentType });
  }
}
