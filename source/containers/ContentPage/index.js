import React, { useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ContentPanel from 'components/ContentPanel';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import request from 'axios';
import URL from 'constants/URL';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { Context } from 'context';
import { connect } from 'react-redux';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

ContentPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.number
};

function ContentPage({
  history,
  match: {
    params: { contentId },
    url
  },
  userId
}) {
  const type = url.split('/')[1].slice(0, -1);
  const {
    contentPage: { state, dispatch }
  } = useContext(Context);
  const [{ loaded, exists }, setContentStatus] = useState({
    loaded: false,
    exists: false
  });
  const mounted = useRef(null);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);
  useEffect(() => {
    mounted.current = true;
    document.getElementById('App').scrollTop = 0;
    BodyRef.current.scrollTop = 0;
    initContent();
    async function initContent() {
      try {
        const {
          data: { exists }
        } = await request.get(
          `${URL}/content/check?contentId=${contentId}&type=${type}`
        );
        if (mounted.current) {
          setContentStatus({
            loaded: true,
            exists
          });
          onInitContent({ content: { contentId, type } });
        }
      } catch (error) {
        console.error(error);
        setContentStatus({
          loaded: true,
          exists: false
        });
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [contentId, url]);

  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <div
        className={css`
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          margin-top: 1rem;
          padding-bottom: 20rem;
        `}
      >
        <section
          className={css`
            width: 65%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
              min-height: 100vh;
            }
          `}
        >
          {loaded ? (
            exists ? (
              <ContentPanel
                key={state.type + state.contentId}
                autoExpand
                inputAtBottom={state.type === 'comment'}
                commentsLoadLimit={5}
                contentObj={state}
                userId={userId}
                onAttachStar={onAttachStar}
                onChangeSpoilerStatus={onChangeSpoilerStatus}
                onCommentSubmit={onUploadComment}
                onDeleteComment={onDeleteComment}
                onDeleteContent={() => history.push('/')}
                onEditComment={onEditComment}
                onEditContent={onEditContent}
                onEditRewardComment={onEditRewardComment}
                onLikeContent={onLikeContent}
                onInitContent={onInitContent}
                onLoadMoreComments={onLoadMoreComments}
                onLoadMoreReplies={onLoadMoreReplies}
                onLoadRepliesOfReply={onLoadRepliesOfReply}
                onReplySubmit={onUploadReply}
                onSetCommentsShown={onSetCommentsShown}
                onSetRewardLevel={onSetRewardLevel}
                onShowTCReplyInput={onShowTCReplyInput}
                onLoadComments={onLoadComments}
                onTargetCommentSubmit={onTargetCommentSubmit}
              />
            ) : (
              <NotFound />
            )
          ) : (
            <Loading />
          )}
        </section>
      </div>
    </ErrorBoundary>
  );

  function onAttachStar(data) {
    dispatch({
      type: 'ATTACH_STAR',
      data
    });
  }

  function onChangeSpoilerStatus(shown) {
    dispatch({
      type: 'CHANGE_SPOILER_STATUS',
      shown
    });
  }

  function onDeleteComment(commentId) {
    dispatch({
      type: 'DELETE_COMMENT',
      commentId
    });
  }

  function onEditComment({ commentId, editedComment }) {
    dispatch({
      type: 'EDIT_COMMENT',
      commentId,
      editedComment
    });
  }

  function onEditContent(data) {
    dispatch({
      type: 'EDIT_CONTENT',
      data
    });
  }

  function onEditRewardComment({ id, text }) {
    dispatch({
      type: 'EDIT_REWARD_COMMENT',
      id,
      text
    });
  }

  function onInitContent({ content }) {
    dispatch({
      type: 'INIT_CONTENT',
      content
    });
  }

  function onLikeContent({ likes, type, contentId }) {
    dispatch({
      type: 'LIKE_CONTENT',
      likes,
      contentType: type,
      contentId
    });
  }

  function onLoadComments({ comments, loadMoreButton }) {
    dispatch({
      type: 'LOAD_COMMENTS',
      comments,
      loadMoreButton
    });
  }

  function onLoadMoreComments(data) {
    dispatch({
      type: 'LOAD_MORE_COMMENTS',
      data
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

  function onLoadRepliesOfReply({ replies, commentId, replyId }) {
    dispatch({
      type: 'LOAD_REPLIES_OF_REPLY',
      replies,
      commentId,
      replyId
    });
  }

  function onSetCommentsShown() {
    dispatch({
      type: 'SET_COMMENTS_SHOWN'
    });
  }

  function onSetRewardLevel({ rewardLevel }) {
    dispatch({
      type: 'SET_REWARD_LEVEL',
      rewardLevel
    });
  }

  function onShowTCReplyInput() {
    dispatch({
      type: 'SHOW_TC_REPLY_INPUT'
    });
  }

  function onTargetCommentSubmit(data) {
    dispatch({
      type: 'UPLOAD_TARGET_COMMENT',
      data
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
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(ContentPage);
