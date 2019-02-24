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
import DifficultyBar from 'components/DifficultyBar';
import DifficultyModal from 'components/Modals/DifficultyModal';
import Link from 'components/Link';
import withContext from 'components/Wrappers/withContext';
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
  canEditDifficulty: PropTypes.bool,
  comments: PropTypes.array.isRequired,
  description: PropTypes.string,
  difficulty: PropTypes.number,
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
  rootDifficulty: PropTypes.number,
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
  canEditDifficulty,
  contentId,
  description,
  dispatch,
  id,
  title,
  difficulty,
  editRewardComment,
  uploaderAuthLevel,
  username,
  userId,
  timeStamp,
  numComments,
  myId,
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
  setSubjectDifficulty,
  type
}) {
  const [expanded, setExpanded] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [difficultyModalShown, setDifficultyModalShown] = useState(false);
  const [editedTitle, setEditedTitle] = useState(cleanString(title));
  const [editedDescription, setEditedDescription] = useState(description || '');
  const [editDoneButtonDisabled, setEditDoneButtonDisabled] = useState(true);
  const userIsUploader = myId === userId;
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploaderAuthLevel;
  const editButtonEnabled = userIsUploader || userCanEditThis;
  const CommentsRef = useRef(null);

  useEffect(() => {
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const descriptionChanged = editedDescription !== description;
    const editDoneButtonDisabled =
      titleIsEmpty || (!titleChanged && !descriptionChanged);
    setEditDoneButtonDisabled(editDoneButtonDisabled);
  }, [editedTitle, editedDescription]);

  return (
    <div
      style={{
        background: '#fff',
        marginTop: '1rem',
        fontSize: '1.5rem'
      }}
    >
      {difficulty > 0 && <DifficultyBar difficulty={difficulty} />}
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
          {editButtonEnabled && !onEdit && (
            <DropdownButton
              snow
              direction="left"
              menuProps={renderMenuProps()}
            />
          )}
        </div>
        {!onEdit && !!description && (
          <LongText style={{ padding: '1rem 0' }}>{description}</LongText>
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
                }}
              >
                Cancel
              </Button>
              <Button
                primary
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
            {expanded ? (
              <Comments
                inputAreaInnerRef={CommentsRef}
                commentsLoadLimit={10}
                commentsShown={expanded}
                inputTypeLabel={'response'}
                comments={comments}
                loadMoreButton={loadMoreCommentsButton}
                userId={myId}
                onAttachStar={attachStar}
                onCommentSubmit={onUploadComment}
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
                  rootId: contentId,
                  rootType: type,
                  rootObj: {
                    difficulty: rootDifficulty
                  },
                  type: 'subject'
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '8rem'
                }}
              >
                <Button
                  filled
                  success
                  style={{ fontSize: '2rem' }}
                  onClick={onExpand}
                >
                  <Icon icon="comment-alt" />
                  <span style={{ marginLeft: '1rem' }}>
                    Answer
                    {numComments && numComments > 0 ? ` (${numComments})` : ''}
                  </span>
                </Button>
              </div>
            )}
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
      {difficultyModalShown && (
        <DifficultyModal
          type="subject"
          contentId={id}
          difficulty={difficulty}
          onSubmit={data => {
            setSubjectDifficulty(data);
            setDifficultyModalShown(false);
          }}
          onHide={() => setDifficultyModalShown(false)}
        />
      )}
    </div>
  );

  function renderMenuProps() {
    const menuProps = [
      {
        label: 'Edit',
        onClick: () => setOnEdit(true)
      }
    ];
    if (canEditDifficulty) {
      menuProps.push({
        label: 'Set Reward Level',
        onClick: () => setDifficultyModalShown(true)
      });
    }
    menuProps.push({
      label: 'Remove',
      onClick: () => setConfirmModalShown(true)
    });
    return menuProps;
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
    canEditDifficulty: state.UserReducer.canEditDifficulty
  }),
  dispatch => ({ dispatch })
)(withContext({ Component: SubjectPanel, Context }));
