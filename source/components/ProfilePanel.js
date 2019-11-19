import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProfilePic from 'components/ProfilePic';
import Button from 'components/Button';
import ImageEditModal from 'components/Modals/ImageEditModal';
import BioEditModal from 'components/Modals/BioEditModal';
import AlertModal from 'components/Modals/AlertModal';
import RankBar from 'components/RankBar';
import Icon from 'components/Icon';
import Comments from 'components/Comments';
import Link from 'components/Link';
import UserDetails from 'components/UserDetails';
import Loading from 'components/Loading';
import { useHistory } from 'react-router-dom';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { timeSince } from 'helpers/timeStampHelpers';
import { useContentState, useLazyLoad, useMyState } from 'helpers/hooks';
import { useInView } from 'react-intersection-observer';
import {
  useAppContext,
  useContentContext,
  useChatContext,
  useProfileContext
} from 'contexts';

ProfilePanel.propTypes = {
  expandable: PropTypes.bool,
  profileId: PropTypes.number
};

export default function ProfilePanel({ expandable, profileId }) {
  const history = useHistory();
  const {
    requestHelpers: {
      checkIfUserOnline,
      loadChat,
      loadDMChannel,
      loadComments,
      loadProfile,
      uploadBio,
      uploadProfilePic
    }
  } = useAppContext();
  const { isCreator, userId, username } = useMyState();
  const {
    actions: {
      onAttachStar,
      onDeleteComment,
      onEditComment,
      onEditRewardComment,
      onInitContent,
      onLikeComment,
      onLoadComments,
      onLoadMoreComments,
      onLoadMoreReplies,
      onReloadContent,
      onSetCommentsShown,
      onSetOnline,
      onUploadComment,
      onUploadReply,
      onRemoveStatusMsg,
      onSetPlaceholderHeight,
      onSetVisible,
      onUpdateStatusMsg,
      onUpdateBio,
      onUploadProfilePic
    }
  } = useContentContext();
  const profile = useContentState({
    contentType: 'user',
    contentId: profileId
  });
  const [ComponentRef, inView] = useInView({
    threshold: 0
  });
  const PanelRef = useRef(null);
  useLazyLoad({
    contentType: 'user',
    contentId: profileId,
    PanelRef,
    inView,
    onSetPlaceholderHeight,
    onSetVisible
  });
  const {
    childComments = [],
    commentsLoaded,
    commentsLoadMoreButton,
    commentsShown,
    lastActive,
    loaded,
    numMessages,
    online,
    placeholderHeight,
    previewLoaded,
    profileFirstRow,
    profileSecondRow,
    profileThirdRow,
    profilePicId,
    profileTheme,
    twinkleXP,
    username: profileName,
    userType,
    website,
    youtubeUrl,
    visible
  } = profile;
  const {
    state: { loaded: chatLoaded },
    actions: { onInitChat, onOpenDirectMessageChannel }
  } = useChatContext();
  const {
    actions: { onResetProfile }
  } = useProfileContext();

  const [bioEditModalShown, setBioEditModalShown] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [imageUri, setImageUri] = useState();
  const [processing, setProcessing] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [mouseEnteredProfile, setMouseEnteredProfile] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const CommentInputAreaRef = useRef(null);
  const FileInputRef = useRef(null);
  const mounted = useRef(true);
  const loading = useRef(false);

  useEffect(() => {
    mounted.current = true;
    handleCheckIfUserOnline();
    if (!profile.loaded && !loading.current && profileId) {
      handleInitProfile();
    }
    if (!commentsLoaded && !previewLoaded) {
      handleLoadComments();
    }
    async function handleCheckIfUserOnline() {
      const online = await checkIfUserOnline(profileId);
      onSetOnline({ contentId: profileId, contentType: 'user', online });
    }
    async function handleInitProfile() {
      loading.current = true;
      const data = await loadProfile(profileId);
      if (mounted.current) {
        onInitContent({ contentId: profileId, contentType: 'user', ...data });
        loading.current = false;
      }
    }
    async function handleLoadComments() {
      try {
        const data = await loadComments({
          contentId: profileId,
          contentType: 'user',
          limit: 1
        });
        if (mounted.current) {
          onLoadComments({
            ...data,
            contentId: profileId,
            contentType: 'user',
            isPreview: true
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [profileId, userId, profile.loaded]);
  const canEdit = userId === profileId || isCreator;
  const noBio = !profileFirstRow && !profileSecondRow && !profileThirdRow;

  return useMemo(() => {
    return (
      <div ref={ComponentRef} key={profileId}>
        {visible || inView ? (
          <div
            ref={PanelRef}
            className={css`
              background: #fff;
              width: 100%;
              margin-bottom: 1rem;
              line-height: 2.3rem;
              font-size: 1.5rem;
              position: relative;
            `}
          >
            <div
              className={css`
                background: ${Color[profileTheme || 'logoBlue']()};
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
              style={{ padding: userType ? '0.5rem' : undefined }}
            >
              {userType && (
                <div
                  style={{
                    fontSize: '2.2rem',
                    color: '#fff'
                  }}
                >
                  {userType.includes('teacher') ? 'teacher' : userType}
                </div>
              )}
            </div>
            <div
              className={css`
                display: flex;
                flex-direction: column;
                padding: 1rem;
                border: ${Color.borderGray()} 1px solid;
                ${twinkleXP
                  ? 'border-bottom: none;'
                  : `
                  border-bottom-left-radius: ${borderRadius};
                  border-bottom-right-radius: ${borderRadius};
                `};
                border-top: none;
                @media (max-width: ${mobileMaxWidth}) {
                  border-radius: 0;
                  border-left: none;
                  border-right: none;
                }
              `}
            >
              {loaded ? (
                <div
                  style={{ display: 'flex', height: '100%', marginTop: '1rem' }}
                >
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
                      <Link
                        onClick={handleReloadProfile}
                        to={`/users/${profileName}`}
                      >
                        <ProfilePic
                          style={{
                            width: '18rem',
                            height: '18rem',
                            cursor: 'pointer'
                          }}
                          userId={profileId}
                          profilePicId={profilePicId}
                          online={!!online}
                          large
                          statusShown
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
                        color="orange"
                        transparent
                        style={{
                          color: mouseEnteredProfile && Color.orange(),
                          padding: '0.5rem'
                        }}
                        onClick={() => history.push(`/users/${profileName}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                    {youtubeUrl && (
                      <Button
                        color="red"
                        transparent
                        style={{ padding: '0.5rem' }}
                        onClick={() => window.open(youtubeUrl)}
                      >
                        Visit YouTube
                      </Button>
                    )}
                    {website && (
                      <Button
                        color="blue"
                        transparent
                        style={{ padding: '0.5rem' }}
                        onClick={() => window.open(website)}
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
                      removeStatusMsg={onRemoveStatusMsg}
                      updateStatusMsg={onUpdateStatusMsg}
                      onUpdateBio={onUpdateBio}
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
                          <Button
                            transparent
                            onClick={onChangeProfilePictureClick}
                          >
                            Change Pic
                          </Button>
                          <Button
                            transparent
                            onClick={() => setBioEditModalShown(true)}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            Edit Bio
                          </Button>
                          {profileId === userId &&
                            childComments.length > 0 &&
                            renderMessagesButton({
                              style: { marginLeft: '0.5rem' }
                            })}
                        </div>
                      </div>
                    )}
                    {expandable && userId !== profileId && (
                      <div
                        style={{
                          marginTop: noBio ? '2rem' : '1rem',
                          display: 'flex'
                        }}
                      >
                        <Button color="green" onClick={handleTalkClick}>
                          <Icon icon="comments" />
                          <span style={{ marginLeft: '0.7rem' }}>Talk</span>
                        </Button>
                        {renderMessagesButton()}
                      </div>
                    )}
                    {lastActive && !online && profileId !== userId && (
                      <div
                        style={{
                          marginTop: '1rem',
                          fontSize: '1.5rem',
                          color: Color.gray()
                        }}
                      >
                        <p>last online {timeSince(lastActive)}</p>
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
              ) : (
                <Loading />
              )}
              {loaded && (
                <Comments
                  comments={childComments}
                  commentsLoadLimit={5}
                  commentsShown={commentsShown}
                  contentId={profileId}
                  inputAreaInnerRef={CommentInputAreaRef}
                  inputTypeLabel={`message to ${profileName}`}
                  isLoading={loadingComments}
                  loadMoreButton={commentsLoadMoreButton}
                  noInput={profileId === userId}
                  numPreviews={1}
                  onAttachStar={onAttachStar}
                  onCommentSubmit={onUploadComment}
                  onDelete={onDeleteComment}
                  onEditDone={onEditComment}
                  onLikeClick={onLikeComment}
                  onLoadMoreComments={onLoadMoreComments}
                  onLoadMoreReplies={onLoadMoreReplies}
                  onPreviewClick={onExpandComments}
                  onReplySubmit={onUploadReply}
                  onRewardCommentEdit={onEditRewardComment}
                  parent={{ ...profile, contentType: 'user' }}
                  style={{ marginTop: '1rem' }}
                  userId={userId}
                />
              )}
            </div>
            {!!twinkleXP && <RankBar profile={profile} />}
            {alertModalShown && (
              <AlertModal
                title="Image is too large (limit: 5mb)"
                content="Please select a smaller image"
                onHide={() => setAlertModalShown(false)}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              margin: '1rem 0 1rem 0',
              height: placeholderHeight || '20rem'
            }}
          />
        )}
      </div>
    );
  }, [
    alertModalShown,
    noBio,
    canEdit,
    profile,
    chatLoaded,
    bioEditModalShown,
    loadingComments,
    imageUri,
    imageEditModalShown,
    inView,
    mouseEnteredProfile,
    placeholderHeight,
    userId,
    visible
  ]);

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

  function handleReloadProfile() {
    onReloadContent({
      contentId: profileId,
      contentType: 'user'
    });
    onResetProfile(username);
  }

  async function handleTalkClick() {
    if (!chatLoaded) {
      const initialData = await loadChat();
      onInitChat(initialData);
    }
    const data = await loadDMChannel({ recepient: profile });
    onOpenDirectMessageChannel({
      user: { id: userId, username },
      recepient: profile,
      channelData: data
    });
    history.push('/chat');
  }

  function onChangeProfilePictureClick() {
    FileInputRef.current.click();
  }

  async function onExpandComments() {
    if (!commentsShown) {
      setLoadingComments(true);
      const { comments, loadMoreButton } = await loadComments({
        contentId: profileId,
        contentType: 'user',
        limit: 5
      });
      onLoadComments({
        comments,
        contentId: profileId,
        contentType: 'user',
        loadMoreButton
      });
      onSetCommentsShown({ contentId: profileId, contentType: 'user' });
      setLoadingComments(false);
    }
  }

  async function onMessagesButtonClick() {
    await onExpandComments();
    if (profileId !== userId) CommentInputAreaRef.current.focus();
  }

  function renderMessagesButton() {
    return (
      <Button
        style={{ marginLeft: '1rem' }}
        disabled={commentsShown && profileId === userId}
        color="logoBlue"
        onClick={onMessagesButtonClick}
      >
        <Icon icon="comment-alt" />
        <span style={{ marginLeft: '0.7rem' }}>
          {profileId === userId ? '' : 'Leave '}
          Message
          {profileId === userId && Number(numMessages) > 0 && !commentsShown
            ? `${numMessages > 1 ? 's' : ''}`
            : ''}
          {Number(numMessages) > 0 && !commentsShown ? ` (${numMessages})` : ''}
        </span>
      </Button>
    );
  }

  async function handleUploadBio(params) {
    const data = await uploadBio({
      ...params,
      profileId
    });
    onUpdateBio(data);
    setBioEditModalShown(false);
  }

  async function uploadImage(image) {
    setProcessing(true);
    const data = await uploadProfilePic({ image });
    onUploadProfilePic({ userId, ...data });
    setImageUri(undefined);
    setProcessing(false);
    setImageEditModalShown(false);
  }
}
