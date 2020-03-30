import React, { useState } from 'react';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import GiveRewardButton from './GiveRewardButton';
import { stringIsEmpty } from 'helpers/stringHelpers';

MessageRewardModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  userToReward: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

export default function MessageRewardModal({ onHide, userToReward, onSubmit }) {
  const [feedback, setFeedback] = useState('');
  return (
    <Modal onHide={onHide}>
      <header>Reward {userToReward.username}</header>
      <main>
        <GiveRewardButton
          rewardIcon="thumbs-up"
          phrase="Good Job"
          feedback={feedback}
          onSetFeedback={setFeedback}
        />
        <GiveRewardButton
          rewardIcon="briefcase"
          phrase="Good Work"
          feedback={feedback}
          onSetFeedback={setFeedback}
        />
        <GiveRewardButton
          rewardIcon="surprise"
          phrase="Amazing Work"
          feedback={feedback}
          onSetFeedback={setFeedback}
        />
        <GiveRewardButton
          rewardIcon="heart"
          phrase="Great Work"
          feedback={feedback}
          onSetFeedback={setFeedback}
        />
        <GiveRewardButton
          rewardIcon="heart-square"
          phrase="Perfect Work"
          feedback={feedback}
          onSetFeedback={setFeedback}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          transparent
          disabled={stringIsEmpty(feedback)}
          style={{ marginRight: '0.7rem' }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </footer>
    </Modal>
  );

  function handleSubmit() {
    onSubmit(feedback);
    onHide();
  }
}
