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
import {
  attachStar,
  deleteVideoComment,
  editRewardComment,
  editVideoComment,
  loadVideoDiscussionComments,
  loadMoreDiscussionComments,
  uploadComment,
  likeVideoComment,
  loadMoreDiscussionReplies,
  editVideoDiscussion,
  deleteVideoDiscussion,
  setDiscussionDifficulty,
  uploadReply
} from 'redux/actions/VideoActions';
import Link from 'components/Link';
import { loadComments } from 'helpers/requestHelpers';
import { Color } from 'constants/css';
import { css } from 'emotion';

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
    editRewardComment: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    loadVideoDiscussionComments: PropTypes.func.isRequired,
    loadMoreComments: PropTypes.func.isRequired,
    loadMoreDiscussionCommentsButton: PropTypes.bool.isRequired,
    myId: PropTypes.number,
    numComments: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    onDiscussionDelete: PropTypes.func.isRequired,
    onDiscussionEditDone: PropTypes.func.isRequired,
    onEditDone: PropTypes.func.isRequired,
    onLikeClick: PropTypes.func.isRequired,
    onLoadMoreReplies: PropTypes.func.isRequired,
    setDiscussionDifficulty: PropTypes.func.isRequired,
    timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string.isRequired,
    uploadComment: PropTypes.func.isRequired,
    uploaderAuthLevel: PropTypes.number.isRequired,
    uploadReply: PropTypes.func.isRequired,
    videoId: PropTypes.number.isRequired
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
      loadMoreDiscussionCommentsButton,
      onLikeClick,
      onDelete,
      onEditDone,
      onLoadMoreReplies,
      setDiscussionDifficulty,
      uploadComment,
      uploadReply,
      videoId
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
        className={css`
          background: #fff;
          margin-top: 1rem;
          font-size: 1.5rem;
        `}
      >
        {difficulty > 0 && <DifficultyBar difficulty={difficulty} />}
        <div style={{ padding: '1rem' }}>
          <div
            className={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              a {
                font-size: 2.5rem;
                color: ${Color.green()};
                font-weight: bold;
              }
            `}
          >
            {!onEdit && (
              <Link to={`/discussions/${id}`}>{cleanString(title)}</Link>
            )}
            {editButtonEnabled &&
              !onEdit && (
                <DropdownButton
                  snow
                  direction="left"
                  menuProps={this.renderMenuProps()}
                />
              )}
          </div>
          {!onEdit &&
            description && (
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
                  inputTypeLabel={'answer'}
                  type="videoDiscussionPanel"
                  comments={comments}
                  loadMoreButton={loadMoreDiscussionCommentsButton}
                  userId={myId}
                  onAttachStar={attachStar}
                  onCommentSubmit={uploadComment}
                  onDelete={onDelete}
                  onEditDone={onEditDone}
                  onLikeClick={onLikeClick}
                  onLoadMoreReplies={onLoadMoreReplies}
                  onReplySubmit={uploadReply}
                  onRewardCommentEdit={editRewardComment}
                  contentId={id}
                  loadMoreComments={this.loadMoreComments}
                  parent={{
                    id,
                    rootId: videoId,
                    rootType: 'video',
                    type: 'discussion',
                    rootObj: true
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
    const { id, loadMoreComments } = this.props;
    loadMoreComments({ data, discussionId: id });
  };

  onDelete = () => {
    const { id, onDiscussionDelete } = this.props;
    onDiscussionDelete(id, () => {
      this.setState({ confirmModalShown: false });
    });
  };

  onExpand = async() => {
    const { loadVideoDiscussionComments, id } = this.props;
    this.setState({ expanded: true });
    try {
      const data = await loadComments({ type: 'discussion', id, limit: 10 });
      if (data) loadVideoDiscussionComments({ data, discussionId: id });
    } catch (error) {
      console.error(error.response || error);
    }
  };

  onEditDone = async() => {
    const { editedTitle, editedDescription } = this.state;
    const { id, onDiscussionEditDone } = this.props;
    await onDiscussionEditDone(
      id,
      finalizeEmoji(editedTitle),
      finalizeEmoji(editedDescription)
    );
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
  {
    attachStar,
    editRewardComment,
    onDelete: deleteVideoComment,
    onEditDone: editVideoComment,
    loadVideoDiscussionComments,
    loadMoreComments: loadMoreDiscussionComments,
    onLikeClick: likeVideoComment,
    onLoadMoreReplies: loadMoreDiscussionReplies,
    onDiscussionEditDone: editVideoDiscussion,
    onDiscussionDelete: deleteVideoDiscussion,
    setDiscussionDifficulty,
    uploadComment,
    uploadReply
  }
)(DiscussionPanel);
