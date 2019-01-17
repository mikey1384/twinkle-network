import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'components/Button';
import { timeSince } from 'helpers/timeStampHelpers';
import UsernameText from 'components/Texts/UsernameText';
import Comments from 'components/Comments';
import DropdownButton from 'components/Buttons/DropdownButton';
import { connect } from 'react-redux';
import {
  cleanString,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji
} from 'helpers/stringHelpers';
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
import {
  deleteDiscussion,
  editDiscussion,
  loadComments
} from 'helpers/requestHelpers';
import { Color } from 'constants/css';

class DiscussionPanel extends Component {
  static propTypes = {
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
    onLoadDiscussionComments: PropTypes.func.isRequired,
    onLoadMoreComments: PropTypes.func.isRequired,
    loadMoreCommentsButton: PropTypes.bool.isRequired,
    myId: PropTypes.number,
    numComments: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    onDiscussionDelete: PropTypes.func.isRequired,
    onDiscussionEditDone: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    onUploadComment: PropTypes.func.isRequired,
    onUploadReply: PropTypes.func.isRequired,
    rootDifficulty: PropTypes.number,
    setDiscussionDifficulty: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string.isRequired,
    uploaderAuthLevel: PropTypes.number.isRequired,
    contentId: PropTypes.number.isRequired
  };

  constructor(props) {
    super();
    this.state = {
      expanded: false,
      onEdit: false,
      confirmModalShown: false,
      difficultyModalShown: false,
      editedTitle: cleanString(props.title),
      editedDescription: props.description || '',
      editDoneButtonDisabled: true
    };
  }

  render() {
    const {
      attachStar,
      authLevel,
      canDelete,
      canEdit,
      id,
      title,
      description,
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
      onDelete,
      onEditDone,
      onLoadMoreReplies,
      onUploadComment,
      onUploadReply,
      setDiscussionDifficulty,
      contentId,
      type,
      rootDifficulty
    } = this.props;
    const {
      difficultyModalShown,
      expanded,
      onEdit,
      confirmModalShown,
      editedTitle,
      editedDescription,
      editDoneButtonDisabled
    } = this.state;
    const userIsUploader = myId === userId;
    const userCanEditThis =
      (canEdit || canDelete) && authLevel > uploaderAuthLevel;
    const editButtonEnabled = userIsUploader || userCanEditThis;
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
                to={`/discussions/${id}`}
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
                menuProps={this.renderMenuProps()}
              />
            )}
          </div>
          {!onEdit && description && (
            <LongText style={{ padding: '1rem 0' }}>{description}</LongText>
          )}
          {onEdit && (
            <form onSubmit={event => event.preventDefault()}>
              <Input
                autoFocus
                type="text"
                placeholder="Enter Title..."
                value={editedTitle}
                onChange={text =>
                  this.setState(
                    { editedTitle: text },
                    this.determineEditButtonDoneStatus
                  )
                }
                onKeyUp={event =>
                  this.setState({ editedTitle: addEmoji(event.target.value) })
                }
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
                onChange={event =>
                  this.setState(
                    { editedDescription: event.target.value },
                    this.determineEditButtonDoneStatus
                  )
                }
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
                  onClick={() =>
                    this.setState({
                      onEdit: false,
                      editedTitle: cleanString(title),
                      editedDescription: description
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  primary
                  style={{
                    fontSize: '1.8rem'
                  }}
                  onClick={this.onEditDone}
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
                  autoFocus
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
                  onLoadMoreReplies={onLoadMoreReplies}
                  onReplySubmit={onUploadReply}
                  onRewardCommentEdit={editRewardComment}
                  contentId={id}
                  loadMoreComments={this.loadMoreComments}
                  parent={{
                    id,
                    rootId: contentId,
                    rootType: type,
                    rootObj: {
                      difficulty: rootDifficulty
                    },
                    type: 'discussion'
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
                    onClick={this.onExpand}
                  >
                    <Icon icon="comment-alt" />
                    <span style={{ marginLeft: '1rem' }}>
                      Answer
                      {numComments && numComments > 0
                        ? ` (${numComments})`
                        : ''}
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
            onHide={() => this.setState({ confirmModalShown: false })}
            title="Remove Discussion"
            onConfirm={this.onDelete}
          />
        )}
        {difficultyModalShown && (
          <DifficultyModal
            type="discussion"
            contentId={id}
            difficulty={difficulty}
            onSubmit={data => {
              setDiscussionDifficulty(data);
              this.setState({ difficultyModalShown: false });
            }}
            onHide={() => this.setState({ difficultyModalShown: false })}
          />
        )}
      </div>
    );
  }

  renderMenuProps = () => {
    const { canEditDifficulty } = this.props;
    const menuProps = [
      {
        label: 'Edit',
        onClick: () => this.setState({ onEdit: true })
      }
    ];
    if (canEditDifficulty) {
      menuProps.push({
        label: 'Set Difficulty',
        onClick: () => this.setState({ difficultyModalShown: true })
      });
    }
    menuProps.push({
      label: 'Remove',
      onClick: () => this.setState({ confirmModalShown: true })
    });
    return menuProps;
  };

  determineEditButtonDoneStatus = () => {
    const { editedTitle, editedDescription } = this.state;
    const { title, description } = this.props;
    const titleIsEmpty = stringIsEmpty(editedTitle);
    const titleChanged = editedTitle !== title;
    const descriptionChanged = editedDescription !== description;
    const editDoneButtonDisabled =
      titleIsEmpty || (!titleChanged && !descriptionChanged);
    this.setState({ editDoneButtonDisabled });
  };

  loadMoreComments = data => {
    const { id, onLoadMoreComments } = this.props;
    onLoadMoreComments({ data, discussionId: id });
  };

  onDelete = async() => {
    const { dispatch, id, onDiscussionDelete } = this.props;
    try {
      await deleteDiscussion({ discussionId: id, dispatch });
      this.setState({ confirmModalShown: false });
      onDiscussionDelete(id);
    } catch (error) {
      return console.error(error);
    }
  };

  onExpand = async() => {
    const { onLoadDiscussionComments, id } = this.props;
    this.setState({ expanded: true });
    try {
      const data = await loadComments({ type: 'discussion', id, limit: 10 });
      if (data) onLoadDiscussionComments({ data, discussionId: id });
    } catch (error) {
      console.error(error.response || error);
    }
  };

  onEditDone = async() => {
    const { editedTitle, editedDescription } = this.state;
    const { id, dispatch, onDiscussionEditDone } = this.props;
    const editedDiscussion = await editDiscussion({
      discussionId: id,
      editedTitle: finalizeEmoji(editedTitle),
      editedDescription: finalizeEmoji(editedDescription),
      dispatch
    });
    onDiscussionEditDone({ editedDiscussion, discussionId: id });
    this.setState({
      onEdit: false,
      editDoneButtonDisabled: true
    });
  };
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
)(withContext({ Component: DiscussionPanel, Context }));
