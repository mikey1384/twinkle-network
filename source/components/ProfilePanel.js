import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import ImageEditModal from 'components/Modals/ImageEditModal';
import BioEditModal from 'components/Modals/BioEditModal';
import {
  removeStatusMsg,
  updateStatusMsg,
  uploadProfilePic,
  uploadBio
} from 'redux/actions/UserActions';
import AlertModal from 'components/Modals/AlertModal';
import RankBar from 'components/RankBar';
import Icon from 'components/Icon';
import Comments from 'components/Comments';
import Link from 'components/Link';
import UserDetails from 'components/UserDetails';
import { openDirectMessageChannel } from 'redux/actions/ChatActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { loadComments } from 'helpers/requestHelpers';
import { timeSince } from 'helpers/timeStampHelpers';

ProfilePanel.propTypes = {
  expandable: PropTypes.bool,
  history: PropTypes.object,
  isCreator: PropTypes.bool,
  updateStatusMsg: PropTypes.func,
  openDirectMessageChannel: PropTypes.func,
  profile: PropTypes.object,
  removeStatusMsg: PropTypes.func,
  userId: PropTypes.number,
  uploadBio: PropTypes.func,
  uploadProfilePic: PropTypes.func,
  username: PropTypes.string
};

function ProfilePanel({
  history,
  profile,
  profile: { id, numMessages },
  userId,
  expandable,
  isCreator,
  openDirectMessageChannel,
  removeStatusMsg,
  updateStatusMsg,
  uploadBio,
  uploadProfilePic,
  username
}) {
  const [bioEditModalShown, setBioEditModalShown] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsShown, setCommentsShown] = useState(false);
  const [commentsLoadMoreButton, setCommentsLoadMoreButton] = useState(false);
  const [imageUri, setImageUri] = useState();
  const [processing, setProcessing] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [mouseEnteredProfile, setMouseEnteredProfile] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const CommentInputAreaRef = useRef(null);
  const FileInputRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    handleLoadComments();
    async function handleLoadComments() {
      try {
        const { comments } = await loadComments({
          id: profile.id,
          type: 'user',
          limit: 1
        });
        if (mounted.current) {
          setComments(comments);
        }
      } catch (error) {
        console.error(error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [profile.id]);
  const canEdit = userId === profile.id || isCreator;
  const { profileFirstRow, profileSecondRow, profileThirdRow } = profile;
  const noProfile = !profileFirstRow && !profileSecondRow && !profileThirdRow;

  return (
    <div
      key={profile.id}
      className={css`
        width: 100%;
        margin-bottom: 1rem;
        line-height: 2.3rem;
        font-size: 1.5rem;
        position: relative;
      `}
    >
      <div
        className={css`
          background: ${Color[profile.profileTheme || 'logoBlue']()};
          min-height: 2.5rem;
          border-top-right-radius: ${borderRadius};
          border-top-left-radius: ${borderRadius};
          border-bottom: none;
          display: flex;
          align-items: center;
          justify-content: center;
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        `}
        style={{ padding: profile.userType ? '0.5rem' : undefined }}
      >
        {profile.userType && (
          <div
            style={{
              fontSize: '2.2rem',
              color: '#fff'
            }}
          >
            {profile.userType.includes('teacher')
              ? 'teacher'
              : profile.userType}
          </div>
        )}
      </div>
      <div
        className={css`
            background: #fff;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            border: #e7e7e7 1px solid;
              ${
                profile.twinkleXP
                  ? 'border-bottom: none;'
                  : `
                border-bottom-left-radius: ${borderRadius};
                border-bottom-right-radius: ${borderRadius};
              `
              }
            @media (max-width: ${mobileMaxWidth}) {
              border-radius: 0;
              border-left: none;
              border-right: none;
            }
          `}
      >
        <div style={{ display: 'flex', height: '100%', marginTop: '1rem' }}>
          <div
            style={{
              width: '20rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              onMouseEnter={() => setMouseEnteredProfile(true)}
              onMouseLeave={() => setMouseEnteredProfile(false)}
            >
              <Link to={`/users/${profile.username}`}>
                <ProfilePic
                  style={{
                    width: '18rem',
                    height: '18rem',
                    cursor: 'pointer'
                  }}
                  userId={profile.id}
                  profilePicId={profile.profilePicId}
                  online={userId === profile.id || !!profile.online}
                  large
                />
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '1.5rem'
              }}
            >
              <Button
                warning
                transparent
                style={{
                  color: mouseEnteredProfile && Color.orange(),
                  padding: '0.5rem'
                }}
                onClick={() => history.push(`/users/${profile.username}`)}
              >
                View Profile
              </Button>
            </div>
            {profile.youtubeUrl && (
              <Button
                danger
                transparent
                style={{ padding: '0.5rem' }}
                onClick={() => window.open(profile.youtubeUrl)}
              >
                Visit YouTube
              </Button>
            )}
            {profile.website && (
              <Button
                primary
                transparent
                style={{ padding: '0.5rem' }}
                onClick={() => window.open(profile.website)}
              >
                Visit Website
              </Button>
            )}
          </div>
          <div
            style={{
              marginLeft: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              width: 'CALC(100% - 19rem)'
            }}
          >
            <UserDetails
              profile={profile}
              removeStatusMsg={removeStatusMsg}
              updateStatusMsg={updateStatusMsg}
              uploadBio={uploadBio}
              userId={userId}
            />
            {canEdit && (
              <div
                style={{
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex' }}>
                  <Button transparent onClick={onChangeProfilePictureClick}>
                    Change Pic
                  </Button>
                  <Button
                    transparent
                    onClick={() => setBioEditModalShown(true)}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Edit Bio
                  </Button>
                  {profile.id === userId &&
                    comments.length > 0 &&
                    renderMessagesButton({
                      style: { marginLeft: '0.5rem' }
                    })}
                </div>
              </div>
            )}
            {expandable && userId !== profile.id && (
              <div
                style={{
                  marginTop: noProfile ? '2rem' : '1rem',
                  display: 'flex'
                }}
              >
                {renderMessagesButton()}
                <Button
                  style={{ marginLeft: '0.5rem' }}
                  success
                  onClick={() =>
                    openDirectMessageChannel(
                      { id: userId, username },
                      { id: profile.id, username: profile.username },
                      false
                    )
                  }
                >
                  <Icon icon="comments" />
                  <span style={{ marginLeft: '0.7rem' }}>Talk</span>
                </Button>
              </div>
            )}
            {profile.lastActive && !profile.online && profile.id !== userId && (
              <div
                style={{
                  marginTop: '1rem',
                  fontSize: '1.5rem',
                  color: Color.gray()
                }}
              >
                <p>last online {timeSince(profile.lastActive)}</p>
              </div>
            )}
          </div>
          <input
            ref={FileInputRef}
            style={{ display: 'none' }}
            type="file"
            onChange={handlePicture}
            accept="image/*"
          />
          {bioEditModalShown && (
            <BioEditModal
              firstLine={profileFirstRow}
              secondLine={profileSecondRow}
              thirdLine={profileThirdRow}
              onSubmit={handleUploadBio}
              onHide={() => setBioEditModalShown(false)}
            />
          )}
          {imageEditModalShown && (
            <ImageEditModal
              imageUri={imageUri}
              onHide={() => {
                setImageUri(undefined);
                setImageEditModalShown(false);
                setProcessing(false);
              }}
              processing={processing}
              onConfirm={uploadImage}
            />
          )}
        </div>
        <Comments
          comments={comments}
          commentsLoadLimit={20}
          commentsShown={commentsShown}
          contentId={profile.id}
          inputAreaInnerRef={CommentInputAreaRef}
          inputTypeLabel={`message to ${profile.username}`}
          loadMoreButton={commentsLoadMoreButton}
          noInput={profile.id === userId}
          numPreviews={1}
          onAttachStar={onAttachStar}
          onCommentSubmit={onCommentSubmit}
          onDelete={onDeleteComment}
          onEditDone={onEditComment}
          onLikeClick={onLikeComment}
          onLoadMoreComments={onLoadMoreComments}
          onLoadMoreReplies={onLoadMoreReplies}
          onPreviewClick={onExpandComments}
          onReplySubmit={onReplySubmit}
          onRewardCommentEdit={onEditRewardComment}
          parent={{ ...profile, type: 'user' }}
          style={{ marginTop: '1rem' }}
          userId={userId}
        />
      </div>
      {!!profile.twinkleXP && <RankBar profile={profile} />}
      {alertModalShown && (
        <AlertModal
          title="Image is too large (limit: 5mb)"
          content="Please select a smaller image"
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </div>
  );

  function handlePicture(event) {
    const reader = new FileReader();
    const maxSize = 5000;
    const file = event.target.files[0];
    if (file.size / 1000 > maxSize) {
      return setAlertModalShown(true);
    }
    reader.onload = upload => {
      setImageEditModalShown(true);
      setImageUri(upload.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = null;
  }

  function onAttachStar(star) {
    setComments(
      comments.map(comment => {
        return {
          ...comment,
          stars:
            comment.id === star.contentId
              ? (comment.stars || []).concat(star)
              : comment.stars || [],
          replies: comment.replies.map(reply => ({
            ...reply,
            stars:
              reply.id === star.contentId
                ? (reply.stars || []).concat(star)
                : reply.stars || []
          }))
        };
      })
    );
  }

  function onCommentSubmit(comment) {
    setComments([comment].concat(comments));
  }

  function onChangeProfilePictureClick() {
    FileInputRef.current.click();
  }

  function onDeleteComment(commentId) {
    setComments(
      comments
        .filter(comment => comment.id !== commentId)
        .map(comment => ({
          ...comment,
          replies: (comment.replies || []).filter(
            reply => reply.id !== commentId
          )
        }))
    );
  }

  function onEditComment({ editedComment, commentId }) {
    setComments(
      comments.map(comment => ({
        ...comment,
        content: comment.id === commentId ? editedComment : comment.content,
        replies: comment.replies
          ? comment.replies.map(reply =>
              reply.id === commentId
                ? {
                    ...reply,
                    content: editedComment
                  }
                : reply
            )
          : []
      }))
    );
  }

  function onEditRewardComment({ id, text }) {
    setComments(
      comments.map(comment => ({
        ...comment,
        stars: comment.stars
          ? comment.stars.map(star => ({
              ...star,
              rewardComment: star.id === id ? text : star.rewardComment
            }))
          : [],
        replies: comment.replies.map(reply => ({
          ...reply,
          stars: reply.stars
            ? reply.stars.map(star => ({
                ...star,
                rewardComment: star.id === id ? text : star.rewardComment
              }))
            : []
        }))
      }))
    );
  }

  async function onExpandComments() {
    if (!commentsShown) {
      const { comments, loadMoreButton } = await loadComments({
        id: profile.id,
        type: 'user',
        limit: 5
      });
      setComments(comments);
      setCommentsShown(true);
      setCommentsLoadMoreButton(loadMoreButton);
    }
  }

  function onLikeComment({ commentId, likes }) {
    setComments(
      comments.map(comment => ({
        ...comment,
        likes: comment.id === commentId ? likes : comment.likes,
        replies: comment.replies
          ? comment.replies.map(reply =>
              reply.id === commentId
                ? {
                    ...reply,
                    likes
                  }
                : reply
            )
          : []
      }))
    );
  }

  function onLoadMoreComments({ comments: newComments, loadMoreButton }) {
    setComments(comments.concat(newComments));
    setCommentsLoadMoreButton(loadMoreButton);
  }

  function onLoadMoreReplies({ commentId, replies, loadMoreButton }) {
    setComments(
      comments.map(comment => ({
        ...comment,
        replies:
          comment.id === commentId
            ? replies.concat(comment.replies)
            : comment.replies,
        loadMoreButton:
          comment.id === commentId ? loadMoreButton : comment.loadMoreButton
      }))
    );
  }

  async function onMessagesButtonClick() {
    await onExpandComments();
    if (profile.id !== userId) CommentInputAreaRef.current.focus();
  }

  function onReplySubmit(data) {
    setComments(
      comments.map(comment => {
        let match = false;
        let commentId = data.replyId || data.commentId;
        if (comment.id === commentId) {
          match = true;
        } else {
          for (let reply of comment.replies || []) {
            if (reply.id === commentId) {
              match = true;
              break;
            }
          }
        }
        return {
          ...comment,
          replies: match ? comment.replies.concat([data]) : comment.replies
        };
      })
    );
  }

  function renderMessagesButton(props = {}) {
    return (
      <Button
        {...props}
        disabled={commentsShown && id === userId}
        logo
        onClick={onMessagesButtonClick}
      >
        <Icon icon="comment-alt" />
        <span style={{ marginLeft: '0.7rem' }}>
          {id === userId ? '' : 'Leave '}
          Message
          {id === userId && Number(numMessages) > 0 && !commentsShown
            ? `${numMessages > 1 ? 's' : ''}`
            : ''}
          {Number(numMessages) > 0 && !commentsShown ? ` (${numMessages})` : ''}
        </span>
      </Button>
    );
  }

  async function handleUploadBio(params) {
    await uploadBio({ ...params, profileId: profile.id });
    setBioEditModalShown(false);
  }

  async function uploadImage(image) {
    setProcessing(true);
    await uploadProfilePic(image);
    setImageUri(undefined);
    setProcessing(false);
    setImageEditModalShown(false);
  }
}

export default connect(
  state => ({
    isCreator: state.UserReducer.isCreator,
    userId: state.UserReducer.userId,
    username: state.UserReducer.username
  }),
  {
    removeStatusMsg,
    updateStatusMsg,
    uploadProfilePic,
    uploadBio,
    openDirectMessageChannel
  }
)(withRouter(ProfilePanel));
