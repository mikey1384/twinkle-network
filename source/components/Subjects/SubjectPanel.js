import React, { useEffect, useRef, useState } from 'react';
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
import withContext from 'components/Wrappers/withContext';
import SecretAnswer from 'components/SecretAnswer';
import StarButton from 'components/Buttons/StarButton';
import Context from './Context';
import { connect } from 'react-redux';
import {
  deleteSubject,
  editSubject,
  loadComments
} from 'helpers/requestHelpers';
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';

SubjectPanel.propTypes = {
  attachStar: PropTypes.func.isRequired,
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canEditRewardLevel: PropTypes.bool,
  comments: PropTypes.array.isRequired,
  description: PropTypes.string,
  rewardLevel: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  editRewardComment: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onLoadSubjectComments: PropTypes.func.isRequired,
  onLoadMoreComments: PropTypes.func.isRequired,
  loadMoreCommentsButton: PropTypes.bool.isRequired,
  myId: PropTypes.number,
  numComments: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  onSubjectDelete: PropTypes.func.isRequired,
  onSubjectEditDone: PropTypes.func.isRequired,
  onLikeClick: PropTypes.func.isRequired,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onUploadComment: PropTypes.func.isRequired,
  onUploadReply: PropTypes.func.isRequired,
  profileTheme: PropTypes.string,
  rootDifficulty: PropTypes.number,
  secretAnswer: PropTypes.string,
  setSubjectDifficulty: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  userId: PropTypes.number,
  username: PropTypes.string.isRequired,
  uploaderAuthLevel: PropTypes.number.isRequired,
  contentId: PropTypes.number.isRequired
};

function SubjectPanel({
  attachStar,
  authLevel,
  canDelete,
  canEdit,
  canEditRewardLevel,
  contentId,
  description,
  dispatch,
  id,
  title,
  rewardLevel,
  editRewardComment,
  uploaderAuthLevel,
  username,
  userId,
  timeStamp,
  numComments,
  myId,
  profileTheme,
  comments,
  loadMoreCommentsButton,
  onLikeClick,
  onLoadMoreComments,
  onDelete,
  onEditDone,
  onLoadMoreReplies,
  onLoadSubjectComments,
  onSubjectDelete,
  onSubjectEditDone,
  onUploadComment,
  onUploadReply,
  rootDifficulty,
  secretAnswer,
  setSubjectDifficulty,
  type
}) {
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
  const themeColor = profileTheme || 'logoBlue';
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
                type="subject"
                rewardLevel={rewardLevel}
                onSetRewardLevel={setSubjectDifficulty}
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
              type="text"
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
                color={themeColor}
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
                  rewardLevel: rootDifficulty,
                  type
                },
                type: 'subject'
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
      await deleteSubject({ subjectId: id, dispatch });
      setConfirmModalShown(false);
      onSubjectDelete(id);
    } catch (error) {
      return console.error(error);
    }
  }

  async function onExpand() {
    setExpanded(true);
    try {
      const data = await loadComments({ type: 'subject', id, limit: 10 });
      CommentsRef.current.focus();
      onLoadSubjectComments({ data, subjectId: id });
    } catch (error) {
      console.error(error.response || error);
    }
  }

  async function handleEditDone() {
    const editedSubject = await editSubject({
      subjectId: id,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      editedSecretAnswer: finalizeEmoji(editedSecretAnswer),
      dispatch
    });
    onSubjectEditDone({ editedSubject, subjectId: id });
    setOnEdit(false);
    setEditDoneButtonDisabled(true);
  }
}

export default connect(
  state => ({
    myId: state.UserReducer.userId,
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canEditRewardLevel: state.UserReducer.canEditRewardLevel,
    profileTheme: state.UserReducer.profileTheme
  }),
  dispatch => ({ dispatch })
)(withContext({ Component: SubjectPanel, Context }));
