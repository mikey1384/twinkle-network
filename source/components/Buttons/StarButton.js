import React, { useRef, useState } from 'react';
import { useOutsideClick } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import DropdownList from 'components/DropdownList';
import RewardLevelModal from 'components/Modals/RewardLevelModal';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext } from 'contexts';

StarButton.propTypes = {
  byUser: PropTypes.bool,
  contentId: PropTypes.number,
  rewardLevel: PropTypes.number,
  direction: PropTypes.string,
  filled: PropTypes.bool,
  onSetRewardLevel: PropTypes.func,
  onToggleByUser: PropTypes.func,
  style: PropTypes.object,
  contentType: PropTypes.string.isRequired,
  uploader: PropTypes.object
};

export default function StarButton({
  byUser,
  contentId,
  contentType,
  rewardLevel,
  direction = 'left',
  filled,
  onSetRewardLevel,
  onToggleByUser,
  uploader,
  style
}) {
  const {
    requestHelpers: { setByUser }
  } = useAppContext();
  const [rewardLevelModalShown, setRewardLevelModalShown] = useState(false);
  const [menuShown, setMenuShown] = useState(false);
  const StarButtonRef = useRef(null);
  useOutsideClick(StarButtonRef, () => setMenuShown(false));

  return (
    <ErrorBoundary>
      <div ref={StarButtonRef} style={style}>
        <Button
          color={!!rewardLevel && byUser ? 'gold' : byUser ? 'orange' : 'pink'}
          filled={!!rewardLevel || byUser || filled}
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
          contentType={contentType}
          contentId={contentId}
          rewardLevel={rewardLevel}
          onSubmit={data => {
            onSetRewardLevel({ ...data, contentType, contentId });
            setRewardLevelModalShown(false);
          }}
          onHide={() => setRewardLevelModalShown(false)}
        />
      )}
    </ErrorBoundary>
  );

  function onClick() {
    if (contentType === 'video') {
      return setMenuShown(!menuShown);
    }
    return setRewardLevelModalShown(true);
  }

  function showRewardLevelModal() {
    setRewardLevelModalShown(true);
    setMenuShown(false);
  }

  async function toggleByUser() {
    const byUser = await setByUser({ contentId });
    onToggleByUser(byUser);
    setMenuShown(false);
  }
}
