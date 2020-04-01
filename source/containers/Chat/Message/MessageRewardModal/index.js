import React, { useMemo, useState } from 'react';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import RewardFeedback from './RewardFeedback';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import { rewardReasons } from 'constants/defaultValues';
import { addCommasToNumber, stringIsEmpty } from 'helpers/stringHelpers';

MessageRewardModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  userToReward: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

export default function MessageRewardModal({ onHide, userToReward, onSubmit }) {
  const [feedback, setFeedback] = useState('');
  const [rewardAmount, setRewardAmount] = useState(0);
  const submitDisabled = useMemo(
    () => !rewardAmount || stringIsEmpty(feedback),
    [feedback, rewardAmount]
  );

  return (
    <Modal onHide={onHide}>
      <header>Reward {userToReward.username}</header>
      <main>
        <div style={{ width: '100%' }}>
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}
          >
            <span>{addCommasToNumber(rewardAmount * 200)} XP</span>
          </div>
          <RewardLevelForm
            icon="certificate"
            rewardLevel={rewardAmount}
            onSetRewardLevel={setRewardAmount}
            style={{ width: '100%', textAlign: 'center', fontSize: '3rem' }}
          />
        </div>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {Object.entries(rewardReasons).map(
            ([key, { message, color, icon }]) => (
              <RewardFeedback
                key={key}
                color={color}
                rewardIcon={icon}
                phrase={message}
                feedback={feedback}
                onSetFeedback={setFeedback}
              />
            )
          )}
        </div>
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          color="blue"
          disabled={submitDisabled}
          style={{ marginRight: '0.7rem' }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </footer>
    </Modal>
  );

  function handleSubmit() {
    onSubmit({ feedback, amount: rewardAmount * 200 });
    onHide();
  }
}
