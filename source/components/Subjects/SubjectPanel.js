import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import UsernameText from 'components/Texts/UsernameText';
import Comments from 'components/Comments';
import DropdownButton from 'components/Buttons/DropdownButton';
import Textarea from 'components/Texts/Textarea';
import LongText from 'components/Texts/LongText';
import ConfirmModal from 'components/Modals/ConfirmModal';
import Icon from 'components/Icon';
import Input from 'components/Texts/Input';
import RewardLevelBar from 'components/RewardLevelBar';
import Link from 'components/Link';
import SecretAnswer from 'components/SecretAnswer';
import StarButton from 'components/Buttons/StarButton';
import LocalContext from './Context';
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { useAppContext } from 'context';

SubjectPanel.propTypes = {
  comments: PropTypes.array.isRequired,
  contentType: PropTypes.string.isRequired,
  description: PropTypes.string,
  rewardLevel: PropTypes.number,
  id: PropTypes.number.isRequired,
  loadMoreCommentsButton: PropTypes.bool.isRequired,
  numComments: PropTypes.string,
  rootRewardLevel: PropTypes.number,
  secretAnswer: PropTypes.string,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.string.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string.isRequired,
  uploaderAuthLevel: PropTypes.number.isRequired,
  contentId: PropTypes.number.isRequired
};

export default function SubjectPanel({
  contentId,
  contentType,
  description,
  id,
  title,
  rewardLevel,
  uploaderAuthLevel,
  username,
  userId,
  timeStamp,
  numComments,
  comments,
  loadMoreCommentsButton,
  rootRewardLevel,
  secretAnswer
}) {
  const {
    user: {
      state: {
        authLevel,
        canDelete,
        canEdit,
        canEditRewardLevel,
        profileTheme,
        userId: myId
      }
    },
    requestHelpers: { deleteSubject, editSubject, loadComments }
  } = useAppContext();
  const {
    attachStar,
    editRewardComment,
    onDelete,
    onEditDone,
    onLikeClick,
    onLoadMoreComments,
    onLoadMoreReplies,
    onSubjectEditDone,
    onSubjectDelete,
    onLoadSubjectComments,
    setSubjectRewardLevel,
    onUploadComment,
    onUploadReply
  } = useContext(LocalContext);
  const [expanded, setExpanded] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [editedTitle, setEditedTitle] = useState(cleanString(title));
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [secretShown, setSecretShown] = useState(false);
  const [editedSecretAnswer, setEditedSecretAnswer] = useState(
    secretAnswer || ''
  );
  const [editDoneButtonDisabled, setEditDoneButtonDisabled] = useState(true);
  const userIsUploader = myId === userId;
  const userHasHigherAuthLevel = authLevel > uploaderAuthLevel;
  const userCanEditThis = (canEdit || canDelete) && userHasHigherAuthLevel;
  const editButtonEnabled = userIsUploader || userCanEditThis;
  const CommentsRef = useRef(null);

  useEffect(() => {
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const descriptionChanged = editedDescription !== description;
    const secretAnswerChanged = editedSecretAnswer !== secretAnswer;
    const editDoneButtonDisabled =
      titleIsEmpty ||
      (!titleChanged && !descriptionChanged && !secretAnswerChanged);
    setEditDoneButtonDisabled(editDoneButtonDisabled);
  }, [editedTitle, editedDescription, editedSecretAnswer]);

  return (
    <div
      style={{
        background: '#fff',
        marginTop: '1rem',
        fontSize: '1.5rem'
      }}
    >
      {rewardLevel > 0 && <RewardLevelBar rewardLevel={rewardLevel} />}
      <div style={{ padding: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {!onEdit && (
            <Link
              to={`/subjects/${id}`}
              style={{
                fontSize: '2.5rem',
                color: Color.green(),
                fontWeight: 'bold'
              }}
            >
              {cleanString(title)}
            </Link>
          )}
          <div style={{ display: 'flex' }}>
            {canEditRewardLevel && (
              <StarButton
                contentId={id}
                contentType="subject"
                rewardLevel={rewardLevel}
                onSetRewardLevel={setSubjectRewardLevel}
              />
            )}
            <div>
              {editButtonEnabled && !onEdit && (
                <DropdownButton
                  skeuomorphic
                  style={{ marginLeft: '1rem' }}
                  color="darkerGray"
                  direction="left"
                  menuProps={renderMenuProps()}
                />
              )}
            </div>
          </div>
        </div>
        {!onEdit && !!description && (
          <LongText style={{ padding: '1rem 0' }}>{description}</LongText>
        )}
        {secretAnswer && !onEdit && (
          <SecretAnswer
            style={{ marginTop: '1rem' }}
            answer={secretAnswer}
            subjectId={id}
            changeSpoilerStatus={({ shown }) => setSecretShown(shown)}
            shown={secretShown || userId === myId}
            onClick={onExpand}
          />
        )}
        {onEdit && (
          <form onSubmit={event => event.preventDefault()}>
            <Input
              autoFocus
              placeholder="Enter Title..."
              value={editedTitle}
              onChange={text => {
                setEditedTitle(text);
              }}
              onKeyUp={event => setEditedTitle(addEmoji(event.target.value))}
            />
          </form>
        )}
        {onEdit && (
          <div>
            <Textarea
              placeholder="Enter Description (Optional)"
              style={{ marginTop: '1rem' }}
              minRows={5}
              value={editedDescription}
              onChange={event => {
                setEditedDescription(event.target.value);
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>
                Secret Message
              </span>
              <Textarea
                style={{ marginTop: '0.7rem' }}
                placeholder="Enter Secret Message (Optional)"
                minRows={5}
                value={editedSecretAnswer}
                onChange={event => {
                  setEditedSecretAnswer(event.target.value);
                }}
              />
            </div>
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                transparent
                style={{
                  fontSize: '1.7rem',
                  marginRight: '1rem'
                }}
                onClick={() => {
                  setOnEdit(false);
                  setEditedTitle(cleanString(title));
                  setEditedDescription(description);
                  setEditedSecretAnswer(secretAnswer);
                }}
              >
                Cancel
              </Button>
              <Button
                color="blue"
                style={{
                  fontSize: '1.8rem'
                }}
                onClick={handleEditDone}
                disabled={editDoneButtonDisabled}
              >
                Done
              </Button>
            </div>
          </div>
        )}
        {!onEdit && (
          <div style={{ marginTop: '1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '8rem'
              }}
            >
              <Button
                skeuomorphic
                color={profileTheme}
                style={{ fontSize: '2rem' }}
                onClick={onExpand}
              >
                <Icon icon="comment-alt" />
                <span style={{ marginLeft: '1rem' }}>
                  Comment{!expanded && numComments > 1 ? 's' : ''}
                  {!expanded && numComments && numComments > 0
                    ? ` (${numComments})`
                    : ''}
                </span>
              </Button>
            </div>
            <Comments
              inputAreaInnerRef={CommentsRef}
              numInputRows={expanded ? 4 : 2}
              commentsLoadLimit={10}
              commentsHidden={
                !!secretAnswer && !(secretShown || userId === myId)
              }
              commentsShown
              inputTypeLabel={'comment'}
              comments={comments}
              loadMoreButton={loadMoreCommentsButton}
              userId={myId}
              onAttachStar={attachStar}
              onCommentSubmit={handleCommentSubmit}
              onDelete={onDelete}
              onEditDone={onEditDone}
              onLikeClick={onLikeClick}
              onLoadMoreComments={loadMoreComments}
              onLoadMoreReplies={onLoadMoreReplies}
              onReplySubmit={onUploadReply}
              onRewardCommentEdit={editRewardComment}
              contentId={id}
              parent={{
                id,
                rewardLevel,
                rootObj: {
                  id: contentId,
                  rewardLevel: rootRewardLevel,
                  type: contentType
                },
                contentType: 'subject'
              }}
            />
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          By{' '}
          <b>
            <UsernameText
              user={{
                username,
                id: userId
              }}
            />
          </b>{' '}
          &nbsp;|&nbsp; Published {timeSince(timeStamp)}
        </div>
      </div>
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Remove Subject"
          onConfirm={deleteThis}
        />
      )}
    </div>
  );

  function renderMenuProps() {
    const menuProps = [
      {
        label: 'Edit',
        onClick: () => setOnEdit(true)
      },
      {
        label: 'Remove',
        onClick: () => setConfirmModalShown(true)
      }
    ];
    return menuProps;
  }

  function handleCommentSubmit(params) {
    setSecretShown(true);
    onUploadComment(params);
  }

  function loadMoreComments(data) {
    onLoadMoreComments({ data, subjectId: id });
  }

  async function deleteThis() {
    try {
      await deleteSubject({ subjectId: id });
      setConfirmModalShown(false);
      onSubjectDelete(id);
    } catch (error) {
      return console.error(error);
    }
  }

  async function onExpand() {
    setExpanded(true);
    try {
      const data = await loadComments({
        contentType: 'subject',
        contentId: id,
        limit: 10
      });
      CommentsRef.current.focus();
      onLoadSubjectComments({ ...data, subjectId: id, contentType, contentId });
    } catch (error) {
      console.error(error.response || error);
    }
  }

  async function handleEditDone() {
    const editedSubject = await editSubject({
      subjectId: id,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      editedSecretAnswer: finalizeEmoji(editedSecretAnswer)
    });
    onSubjectEditDone({ editedSubject, subjectId: id });
    setOnEdit(false);
    setEditDoneButtonDisabled(true);
  }
}
