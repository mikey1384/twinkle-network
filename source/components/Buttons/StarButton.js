import React, { useRef, useState } from 'react';
import { useOutsideClick } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import DropdownList from 'components/DropdownList';
import RewardLevelModal from 'components/Modals/RewardLevelModal';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { setByUser } from 'helpers/requestHelpers';
import { connect } from 'react-redux';

StarButton.propTypes = {
  byUser: PropTypes.bool,
  contentId: PropTypes.number,
  difficulty: PropTypes.number,
  direction: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  filled: PropTypes.bool,
  onSetDifficulty: PropTypes.func,
  onToggleByUser: PropTypes.func,
  style: PropTypes.object,
  type: PropTypes.string.isRequired,
  uploader: PropTypes.object
};

function StarButton({
  byUser,
  contentId,
  difficulty,
  direction = 'left',
  dispatch,
  filled,
  onSetDifficulty,
  onToggleByUser,
  uploader,
  style,
  type
}) {
  const [rewardLevelModalShown, setRewardLevelModalShown] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const StarButtonRef = useRef(null);
  useOutsideClick(StarButtonRef, () => setMenuShown(false));

  return (
    <ErrorBoundary>
      <div ref={StarButtonRef} style={style}>
        <Button
          color={!!difficulty && byUser ? 'gold' : byUser ? 'orange' : 'pink'}
          filled={!!difficulty || byUser || filled}
          onClick={onClick}
        >
          <Icon icon="star" />
        </Button>
        {menuShown && (
          <DropdownList
            direction={direction}
            style={{
              position: 'absolute',
              right: 0,
              width: '25rem'
            }}
          >
            <li onClick={showRewardLevelModal}>Set Reward Level</li>
            <li onClick={toggleByUser}>
              {byUser
                ? `This video wasn't made by ${uploader.username}`
                : `This video was made by ${uploader.username}`}
            </li>
          </DropdownList>
        )}
      </div>
      {rewardLevelModalShown && (
        <RewardLevelModal
          type={type}
          contentId={contentId}
          difficulty={difficulty}
          onSubmit={async data => {
            await onSetDifficulty(data);
            setRewardLevelModalShown(false);
          }}
          onHide={() => setRewardLevelModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );

  function onClick() {
    if (type === 'video') {
      return setMenuShown(!menuShown);
    }
    return setRewardLevelModalShown(true);
  }

  function showRewardLevelModal() {
    setRewardLevelModalShown(true);
    setMenuShown(false);
  }

  async function toggleByUser() {
    const byUser = await setByUser({ contentId, dispatch });
    onToggleByUser(byUser);
    setMenuShown(false);
  }
}

export default connect(
  null,
  dispatch => ({ dispatch })
)(StarButton);
