import React, { useContext, useEffect, useRef, useState } from 'react';
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
import request from 'axios';
import NotFound from 'components/NotFound';
import { Context } from 'context';
import {
  editLinkPage,
  likeLink,
  updateNumComments
} from 'redux/actions/LinkActions';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { determineXpButtonDisabled } from 'helpers';
import { processedURL } from 'helpers/stringHelpers';
import {
  auth,
  handleError,
  loadComments,
  loadSubjects
} from 'helpers/requestHelpers';
import URL from 'constants/URL';
import Loading from 'components/Loading';
import Description from './Description';

LinkPage.propTypes = {
  authLevel: PropTypes.number,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canStar: PropTypes.bool,
  editLinkPage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  likeLink: PropTypes.func.isRequired,
  reduxDispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  myId: PropTypes.number,
  updateNumComments: PropTypes.func.isRequired
};

function LinkPage({
  authLevel,
  canDelete,
  canEdit,
  canStar,
  reduxDispatch,
  history,
  likeLink,
  location,
  match: {
    params: { linkId }
  },
  myId,
  updateNumComments
}) {
  const [notFound, setNotFound] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [likesModalShown, setLikesModalShown] = useState(false);
  const [xpRewardInterfaceShown, setXpRewardInterfaceShown] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    contentPage: { state, dispatch }
  } = useContext(Context);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useEffect(() => {
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
    setLoading(true);
    initLinkPage();
    async function initLinkPage() {
      try {
        const { data } = await request.get(`${URL}/url/page?linkId=${linkId}`);
        const subjectsObj = await loadSubjects({
          type: 'url',
          contentId: linkId
        });
        const commentsObj = await loadComments({
          id: linkId,
          type: 'url',
          limit: 5
        });
        onInitContent({
          content: {
            ...data,
            contentId: Number(linkId),
            type: 'url',
            childComments: commentsObj?.comments || [],
            commentsLoadMoreButton: commentsObj?.loadMoreButton || false,
            subjects: subjectsObj?.results || [],
            subjectsLoadMoreButton: subjectsObj?.loadMoreButton || false
          }
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
    likes,
    subjects,
    subjectsLoadMoreButton,
    stars,
    timeStamp,
    title,
    uploader,
    uploaderName,
    uploaderAuthLevel,
    ...embedlyProps
  } = state;
  let userLikedThis = false;
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].id === myId) userLikedThis = true;
  }
  const userCanEditThis =
    (canEdit || canDelete) && authLevel > uploaderAuthLevel;
  const userIsUploader = uploader === myId;

  return id && !loading ? (
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
          uploaderAuthLevel={uploaderAuthLevel}
          uploaderId={uploader}
          uploaderName={uploaderName}
          timeStamp={timeStamp}
          myId={myId}
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
          uploaderName={uploaderName}
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
                  myId,
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
                    myId,
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
            userId={myId}
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
              uploaderId={uploader}
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
        type="url"
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
        parent={{ type: 'url', id }}
        className={css`
          padding: 1rem;
          width: 60%;
          background: #fff;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        userId={myId}
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
          userId={myId}
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
    try {
      await request.delete(`${URL}/url?linkId=${id}`, auth());
      history.push('/links');
    } catch (error) {
      handleError(error, reduxDispatch);
    }
  }

  function handleDeleteComment(data) {
    onDeleteComment(data);
    updateNumComments({
      id,
      updateType: 'decrease'
    });
  }

  async function handleEditLinkPage(params) {
    try {
      await request.put(`${URL}/url/page`, params, auth());
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
      editLinkPage({ id: Number(id), title, content: processedURL(content) });
    } catch (error) {
      handleError(error, reduxDispatch);
    }
  }

  function handleLikeLink(likes) {
    onLikeContent({ likes, type: 'url', contentId: linkId });
    likeLink({ likes, id });
  }

  function handleUploadComment(data) {
    onUploadComment(data);
    updateNumComments({
      id,
      updateType: 'increase'
    });
  }

  function handleUploadReply(data) {
    onUploadReply(data);
    updateNumComments({
      id,
      updateType: 'increase'
    });
  }

  function onAttachStar(data) {
    dispatch({
      type: 'ATTACH_STAR',
      data
    });
  }

  function onDeleteComment(commentId) {
    dispatch({
      type: 'DELETE_COMMENT',
      commentId
    });
  }

  function onDeleteSubject(subjectId) {
    dispatch({
      type: 'DELETE_SUBJECT',
      subjectId
    });
  }

  function onEditComment({ commentId, editedComment }) {
    dispatch({
      type: 'EDIT_COMMENT',
      commentId,
      editedComment
    });
  }

  function onEditContent(params) {
    dispatch({
      type: 'EDIT_CONTENT',
      data: params
    });
  }

  function onEditRewardComment({ id, text }) {
    dispatch({
      type: 'EDIT_REWARD_COMMENT',
      id,
      text
    });
  }

  function onEditSubject({ editedSubject, subjectId }) {
    dispatch({
      type: 'EDIT_SUBJECT',
      editedSubject,
      subjectId
    });
  }

  function onInitContent({ content }) {
    dispatch({
      type: 'INIT_CONTENT',
      content
    });
  }

  function onLikeComment({ commentId, likes }) {
    dispatch({
      type: 'LIKE_COMMENT',
      commentId,
      likes
    });
  }

  function onLikeContent({ likes, type, contentId }) {
    dispatch({
      type: 'LIKE_CONTENT',
      likes,
      contentType: type,
      contentId: Number(contentId)
    });
  }

  function onLoadMoreComments(data) {
    dispatch({
      type: 'LOAD_MORE_COMMENTS',
      data
    });
  }

  function onLoadMoreSubjectComments({
    data: { comments, loadMoreButton },
    subjectId
  }) {
    dispatch({
      type: 'LOAD_MORE_SUBJECT_COMMENTS',
      comments,
      loadMoreButton,
      subjectId
    });
  }

  function onLoadMoreSubjectReplies({ commentId, loadMoreButton, replies }) {
    dispatch({
      type: 'LOAD_MORE_SUBJECT_REPLIES',
      commentId,
      loadMoreButton,
      replies
    });
  }

  function onLoadMoreSubjects({ results, loadMoreButton }) {
    dispatch({
      type: 'LOAD_MORE_SUBJECTS',
      results,
      loadMoreButton
    });
  }

  function onLoadMoreReplies({ commentId, replies, loadMoreButton }) {
    dispatch({
      type: 'LOAD_MORE_REPLIES',
      commentId,
      replies,
      loadMoreButton
    });
  }

  function onLoadSubjectComments({
    data: { comments, loadMoreButton },
    subjectId
  }) {
    dispatch({
      type: 'LOAD_SUBJECT_COMMENTS',
      comments,
      loadMoreButton,
      subjectId
    });
  }

  function onSetSubjectRewardLevel({ contentId, rewardLevel }) {
    dispatch({
      type: 'SET_SUBJECT_REWARD_LEVEL',
      contentId: Number(contentId),
      rewardLevel
    });
  }

  function onUploadComment(data) {
    dispatch({
      type: 'UPLOAD_COMMENT',
      data
    });
  }

  function onUploadReply(data) {
    dispatch({
      type: 'UPLOAD_REPLY',
      data
    });
  }

  function onUploadSubject(subject) {
    dispatch({
      type: 'UPLOAD_SUBJECT',
      subject
    });
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar,
    pageProps: state.LinkReducer.linkPage,
    myId: state.UserReducer.userId
  }),
  dispatch => ({
    reduxDispatch: dispatch,
    editLinkPage: params => dispatch(editLinkPage(params)),
    likeLink: likes => dispatch(likeLink(likes)),
    updateNumComments: params => dispatch(updateNumComments(params))
  })
)(LinkPage);
