import React from 'react';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import GiveRewardButton from './GiveRewardButton';
import { useChatContext } from 'contexts';

RewardMessagesModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  rewardTargetUser: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  selection: PropTypes.string,
  setSelection: PropTypes.func
};

export default function RewardMessagesModal({
  onHide,
  rewardTargetUser,
  onSubmit,
  selection,
  setSelection
}) {
  const {
    actions: { onSetReplyTarget }
  } = useChatContext();
  return (
    <Modal onHide={hide}>
      <header>Reward {rewardTargetUser}</header>
      <main>
        <div
          style={{
            fontSize: '2.1rem',
            fontWeight: 'bold'
          }}
        >
          Rewards
        </div>
        <GiveRewardButton
          rewardIcon="thumbs-up"
          phrase="Good Job"
          selection={selection}
          setSelection={setSelection}
        />
        <GiveRewardButton
          rewardIcon="briefcase"
          phrase="Good Work"
          selection={selection}
          setSelection={setSelection}
        />
        <GiveRewardButton
          rewardIcon="surprise"
          phrase="Amazing Work"
          selection={selection}
          setSelection={setSelection}
        />
        <GiveRewardButton
          rewardIcon="heart"
          phrase="Great Work"
          selection={selection}
          setSelection={setSelection}
        />
        <GiveRewardButton
          rewardIcon="heart-square"
          phrase="Perfect Work"
          selection={selection}
          setSelection={setSelection}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          transparent
          disabled={selection === ''}
          style={{ marginRight: '0.7rem' }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </footer>
    </Modal>
  );
  function hide() {
    onSetReplyTarget(null);
    onHide();
    onSetReplyTarget(null);
  }
}
