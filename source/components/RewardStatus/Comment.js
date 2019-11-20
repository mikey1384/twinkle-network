import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import { css } from 'emotion';
import { Color } from 'constants/css';
import LongText from 'components/Texts/LongText';
import EditTextArea from 'components/Texts/EditTextArea';
import DropdownButton from 'components/Buttons/DropdownButton';
import ErrorBoundary from 'components/ErrorBoundary';
import { timeSince } from 'helpers/timeStampHelpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Comment.propTypes = {
  maxRewardableStars: PropTypes.number.isRequired,
  noMarginForEditButton: PropTypes.bool,
  onEditDone: PropTypes.func,
  star: PropTypes.object.isRequired
};

export default function Comment({
  maxRewardableStars,
  noMarginForEditButton,
  onEditDone = () => {},
  star
}) {
  const {
    requestHelpers: { editRewardComment }
  } = useAppContext();
  const {
    actions: { onSetIsEditing }
  } = useContentContext();
  const { authLevel, canEdit, userId } = useMyState();
  const { isEditing } = useContentState({
    contentType: 'reward',
    contentId: star.id
  });
  const userIsUploader = star.rewarderId === userId;
  const editButtonShown = useMemo(() => {
    const userCanEditThis = canEdit && authLevel > star.rewarderAuthLevel;
    return userIsUploader || userCanEditThis;
  }, [authLevel, canEdit, star.rewarderAuthLevel, userIsUploader]);
  const editMenuItems = useMemo(() => {
    const items = [];
    if (userIsUploader || canEdit) {
      items.push({
        label: 'Edit',
        onClick: () =>
          onSetIsEditing({
            contentId: star.id,
            contentType: 'reward',
            isEditing: true
          })
      });
    }
    return items;
  }, [canEdit, onSetIsEditing, star.id, userIsUploader]);

  return (
    <ErrorBoundary>
      <div
        className={css`
          padding: 1rem;
          ${noMarginForEditButton ? `padding-right: 0;` : ''} display: flex;
          align-items: space-between;
        `}
      >
        <div
          className={css`
            width: 6rem;
          `}
        >
          <ProfilePic
            userId={star.rewarderId}
            profilePicId={star.rewarderProfilePicId}
            style={{ width: '5rem', height: '5rem' }}
          />
        </div>
        <div
          className={css`
            width: 100%;
            margin-left: 0.5rem;
            font-size: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          `}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent:
                stringIsEmpty(star.rewardComment) && !isEditing && 'center'
            }}
          >
            <div
              style={{
                width: '100%'
              }}
            >
              <UsernameText
                user={{
                  id: star.rewarderId,
                  username: star.rewarderUsername
                }}
                userId={userId}
              />{' '}
              <span
                style={{
                  fontWeight: 'bold',
                  color:
                    star.rewardAmount >= maxRewardableStars
                      ? Color.gold()
                      : star.rewardAmount >= 10
                      ? Color.orange()
                      : star.rewardAmount >= 5
                      ? Color.pink()
                      : Color.logoBlue()
                }}
              >
                rewarded {star.rewardAmount === 1 ? 'a' : star.rewardAmount}{' '}
                Twinkle
                {star.rewardAmount > 1 ? 's' : ''}
              </span>{' '}
              <span style={{ fontSize: '1.2rem', color: Color.gray() }}>
                ({timeSince(star.timeStamp)})
              </span>
            </div>
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {!isEditing && <LongText>{star.rewardComment}</LongText>}
              {isEditing && (
                <EditTextArea
                  contentId={star.id}
                  contentType="reward"
                  allowEmptyText
                  autoFocus
                  rows={3}
                  text={star.rewardComment}
                  onCancel={() =>
                    onSetIsEditing({
                      contentId: star.id,
                      contentType: 'reward',
                      isEditing: false
                    })
                  }
                  onEditDone={handleSubmitEdit}
                />
              )}
            </div>
          </div>
          {editButtonShown && !isEditing && (
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              direction="left"
              menuProps={editMenuItems}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  async function handleSubmitEdit(editedComment) {
    await editRewardComment({ editedComment, contentId: star.id });
    onEditDone({ id: star.id, text: editedComment });
    onSetIsEditing({
      contentId: star.id,
      contentType: 'reward',
      isEditing: false
    });
  }
}
