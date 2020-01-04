import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/Buttons/DropdownButton';
import ProfilePic from 'components/ProfilePic';
import UsernameText from 'components/Texts/UsernameText';
import EditTextArea from 'components/Texts/EditTextArea';
import ConfirmModal from 'components/Modals/ConfirmModal';
import LongText from 'components/Texts/LongText';
import ErrorBoundary from 'components/ErrorBoundary';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { useContentState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  profilePicId: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string.isRequired
};

export default function Comment({
  comment,
  comment: { id, content, timeStamp },
  onDelete,
  onEditDone,
  profilePicId,
  userId,
  username
}) {
  const {
    requestHelpers: { deleteContent, editContent }
  } = useAppContext();
  const {
    actions: { onSetIsEditing }
  } = useContentContext();
  const { isEditing } = useContentState({
    contentType: 'comment',
    contentId: id
  });
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        paddingTop: '1rem'
      }}
    >
      {!isEditing && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row-reverse'
          }}
        >
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            direction="left"
            style={{ position: 'absolute' }}
            opacity={0.8}
            menuProps={[
              {
                label: 'Edit',
                onClick: () =>
                  onSetIsEditing({
                    contentId: id,
                    contentType: 'comment',
                    isEditing: true
                  })
              },
              {
                label: 'Remove',
                onClick: () => setConfirmModalShown(true)
              }
            ]}
          />
        </div>
      )}
      <div style={{ display: 'flex', width: '100%' }}>
        <ProfilePic
          style={{ width: '5rem', height: '5rem' }}
          userId={userId}
          profilePicId={profilePicId}
        />
        <div style={{ width: '90%', marginLeft: '2%' }}>
          <div>
            <UsernameText
              style={{ fontSize: '1.7rem' }}
              user={{
                username,
                id: userId
              }}
            />{' '}
            <small style={{ color: Color.gray() }}>
              &nbsp;
              {timeSince(timeStamp)}
            </small>
          </div>
          {isEditing ? (
            <EditTextArea
              autoFocus
              contentType="comment"
              contentId={id}
              text={content}
              onCancel={() => ({
                contentId: id,
                contentType: 'comment',
                isEditing: false
              })}
              onEditDone={editComment}
              rows={2}
            />
          ) : (
            <div style={{ paddingLeft: '0px' }}>
              <LongText
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  margin: '0.5rem 0 1rem 0'
                }}
              >
                {content}
              </LongText>
            </div>
          )}
        </div>
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Remove Comment"
          onConfirm={deleteComment}
        />
      )}
    </ErrorBoundary>
  );

  async function deleteComment() {
    await deleteContent({ id: comment.id, contentType: 'comment' });
    setConfirmModalShown(false);
    onDelete(comment.id);
  }

  async function editComment(editedComment) {
    await editContent({
      editedComment,
      contentId: comment.id,
      contentType: 'comment'
    });
    onEditDone({ editedComment, commentId: comment.id });
    onSetIsEditing({
      contentId: id,
      contentType: 'comment',
      isEditing: false
    });
  }
}
