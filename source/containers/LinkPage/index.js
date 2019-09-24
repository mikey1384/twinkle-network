import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Embedly from 'components/Embedly';
import Comments from 'components/Comments';
import Subjects from 'components/Subjects';
import LikeButton from 'components/Buttons/LikeButton';
import Likers from 'components/Likers';
import ConfirmModal from 'components/Modals/ConfirmModal';
import UserListModal from 'components/Modals/UserListModal';
import RewardStatus from 'components/RewardStatus';
import XPRewardInterface from 'components/XPRewardInterface';
import Icon from 'components/Icon';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import Description from './Description';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { determineXpButtonDisabled } from 'helpers';
import { processedURL } from 'helpers/stringHelpers';
import { useAppContext } from 'context';

LinkPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function LinkPage({
  history,
  location,
  match: {
    params: { linkId }
  }
}) {
  const {
    content: {
      state,
      actions: {
        onAttachStar,
        onDeleteComment,
        onDeleteSubject,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onEditSubject,
        onInitContent,
        onLikeComment,
        onLikeContent,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadMoreSubjectComments,
        onLoadMoreSubjectReplies,
        onLoadMoreSubjects,
        onLoadSubjectComments,
        onSetSubjectRewardLevel,
        onUploadComment,
        onUploadReply,
        onUploadSubject
      }
    },
    explore: {
      actions: { onEditLinkPage, onLikeLink, onUpdateNumLinkComments }
    },
    user: {
      state: { authLevel, canDelete, canEdit, canStar, userId }
    },
    requestHelpers: {
      deleteContent,
      editContent,
      loadComments,
      loadContent,
      loadSubjects
    }
  } = useAppContext();
  const [notFound, setNotFound] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [likesModalShown, setLikesModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentState = state['url' + linkId] || {};
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useEffect(() => {
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
    setLoading(true);
    initLinkPage();
    async function initLinkPage() {
      try {
        const data = await loadContent({
          contentId: linkId,
          contentType: 'url'
        });
        const subjectsObj = await loadSubjects({
          contentType: 'url',
          contentId: linkId
        });
        const commentsObj = await loadComments({
          contentId: linkId,
          contentType: 'url',
          limit: 5
        });
        onInitContent({
          ...data,
          loaded: true,
          contentId: Number(linkId),
          contentType: 'url',
          childComments: commentsObj?.comments || [],
          commentsLoadMoreButton: commentsObj?.loadMoreButton || false,
          subjects: subjectsObj?.results || [],
          subjectsLoadMoreButton: subjectsObj?.loadMoreButton || false
        });
        setLoading(false);
      } catch (error) {
        if (error.response) {
          const { data = {} } = error.response;
          if (data.notFound) {
            setNotFound(true);
          }
        }
        console.error(error.response || error);
      }
    }
  }, [location.pathname]);

  const {
    childComments,
    commentsLoadMoreButton,
    content,
    description,
    id,
    likes = [],
    loaded,
    subjects,
    subjectsLoadMoreButton,
    stars,
    timeStamp,
    title,
    uploader,
    ...embedlyProps
  } = contentState;
  let userLikedThis = false;
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].id === userId) userLikedThis = true;
  }
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploader?.authLevel;
  const userIsUploader = uploader?.id === userId;

  return loaded && !loading ? (
    <div
      className={css`
        margin-top: 1rem;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 0;
        }
      `}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        fontSize: '1.7rem',
        paddingBottom: '10rem'
      }}
    >
      <div
        className={css`
          width: 60%;
          background-color: #fff;
          padding-bottom: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <Description
          key={'description' + id}
          content={content}
          uploader={uploader}
          timeStamp={timeStamp}
          myId={userId}
          title={title}
          url={content}
          userCanEditThis={userCanEditThis}
          description={description}
          linkId={id}
          onDelete={() => setConfirmModalShown(true)}
          onEditDone={handleEditLinkPage}
          userIsUploader={userIsUploader}
        />
        <Embedly
          key={'link' + id}
          title={title}
          style={{ marginTop: '2rem' }}
          contentId={id}
          url={content}
          loadingHeight="30rem"
          {...embedlyProps}
        />
        <RewardStatus
          contentType="url"
          onCommentEdit={onEditRewardComment}
          style={{
            fontSize: '1.4rem'
          }}
          stars={stars}
        />
        <div
          style={{
            paddingTop: '1.5rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex' }}>
            <LikeButton
              key={'like' + id}
              filled
              style={{ fontSize: '2rem' }}
              contentType="url"
              contentId={id}
              onClick={handleLikeLink}
              liked={userLikedThis}
            />
            {canStar && userCanEditThis && !userIsUploader && (
              <Button
                color="pink"
                filled
                disabled={determineXpButtonDisabled({
                  myId: userId,
                  xpRewardInterfaceShown,
                  stars
                })}
                style={{
                  fontSize: '2rem',
                  marginLeft: '1rem'
                }}
                onClick={() => setXpRewardInterfaceShown(true)}
              >
                <Icon icon="certificate" />
                <span style={{ marginLeft: '0.7rem' }}>
                  {determineXpButtonDisabled({
                    myId: userId,
                    xpRewardInterfaceShown,
                    stars
                  }) || 'Reward'}
                </span>
              </Button>
            )}
          </div>
          <Likers
            key={'likes' + id}
            style={{ marginTop: '0.5rem', fontSize: '1.3rem' }}
            likes={likes}
            userId={userId}
            onLinkClick={() => setLikesModalShown(true)}
          />
        </div>
        {xpRewardInterfaceShown && (
          <div style={{ padding: '0 1rem' }}>
            <XPRewardInterface
              stars={stars}
              contentType="url"
              contentId={Number(id)}
              noPadding
              uploaderId={uploader.id}
              onRewardSubmit={data => {
                setXpRewardInterfaceShown(false);
                onAttachStar(data);
              }}
            />
          </div>
        )}
      </div>
      <Subjects
        className={css`
          width: 60%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        contentId={id}
        loadMoreButton={subjectsLoadMoreButton}
        subjects={subjects}
        onLoadMoreSubjects={onLoadMoreSubjects}
        onLoadSubjectComments={onLoadSubjectComments}
        onSubjectEditDone={onEditSubject}
        onSubjectDelete={onDeleteSubject}
        setSubjectRewardLevel={onSetSubjectRewardLevel}
        uploadSubject={onUploadSubject}
        contentType="url"
        commentActions={{
          attachStar: onAttachStar,
          editRewardComment: onEditRewardComment,
          onDelete: handleDeleteComment,
          onEditDone: onEditComment,
          onLikeClick: onLikeComment,
          onLoadMoreComments: onLoadMoreSubjectComments,
          onLoadMoreReplies: onLoadMoreSubjectReplies,
          onUploadComment: handleUploadComment,
          onUploadReply: handleUploadReply
        }}
      />
      <Comments
        autoExpand
        comments={childComments}
        inputTypeLabel="comment"
        key={'comments' + id}
        loadMoreButton={commentsLoadMoreButton}
        onAttachStar={onAttachStar}
        onCommentSubmit={handleUploadComment}
        onDelete={handleDeleteComment}
        onEditDone={onEditComment}
        onLikeClick={onLikeComment}
        onLoadMoreComments={onLoadMoreComments}
        onLoadMoreReplies={onLoadMoreReplies}
        onReplySubmit={handleUploadReply}
        onRewardCommentEdit={onEditRewardComment}
        parent={{ contentType: 'url', id }}
        className={css`
          padding: 1rem;
          width: 60%;
          background: #fff;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        userId={userId}
      />
      {confirmModalShown && (
        <ConfirmModal
          key={'confirm' + id}
          title="Remove Link"
          onConfirm={handleDeleteLink}
          onHide={() => setConfirmModalShown(false)}
        />
      )}
      {likesModalShown && (
        <UserListModal
          key={'userlist' + id}
          users={likes}
          userId={userId}
          title="People who liked this"
          description="(You)"
          onHide={() => setLikesModalShown(false)}
        />
      )}
    </div>
  ) : notFound ? (
    <NotFound />
  ) : (
    <Loading text="Loading Page..." />
  );

  async function handleDeleteLink() {
    await deleteContent({ id, contentType: 'url' });
    history.push('/links');
  }

  function handleDeleteComment(data) {
    onDeleteComment(data);
    onUpdateNumLinkComments({
      id,
      updateType: 'decrease'
    });
  }

  async function handleEditLinkPage(params) {
    await editContent(params);
    const {
      linkId: id,
      editedTitle: title,
      editedDescription: description,
      editedUrl: content
    } = params;
    onEditContent({
      content: processedURL(content),
      title,
      description
    });
    onEditLinkPage({ id: Number(id), title, content: processedURL(content) });
  }

  function handleLikeLink(likes) {
    onLikeContent({ likes, contentType: 'url', contentId: linkId });
    onLikeLink({ likes, id });
  }

  function handleUploadComment(params) {
    onUploadComment(params);
    onUpdateNumLinkComments({
      id,
      updateType: 'increase'
    });
  }

  function handleUploadReply(data) {
    onUploadReply(data);
    onUpdateNumLinkComments({
      id,
      updateType: 'increase'
    });
  }
}
