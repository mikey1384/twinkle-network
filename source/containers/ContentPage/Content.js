import React, { useState, useRef, useEffect } from 'react';
import { useContentObj } from 'helpers/hooks';
import PropTypes from 'prop-types';
import ContentPanel from 'components/ContentPanel';
import NotFound from 'components/NotFound';
import Loading from 'components/Loading';
import request from 'axios';
import URL from 'constants/URL';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import { connect } from 'react-redux';

Content.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.number
};

function Content({
  history,
  match,
  match: {
    params: { contentId },
    url
  },
  userId
}) {
  const type = url.split('/')[1].slice(0, -1);
  const {
    contentObj,
    setContentObj,
    onAttachStar,
    onCommentSubmit,
    onReplySubmit,
    onDeleteComment,
    onEditComment,
    onEditRewardComment,
    onEditContent,
    onLikeContent,
    onLoadContent,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadRepliesOfReply,
    onShowComments,
    onSetDifficulty,
    onTargetCommentSubmit
  } = useContentObj({ contentId, type });
  const [{ loaded, exists }, setContentStatus] = useState({
    loaded: false,
    exists: false
  });
  const mounted = useRef(null);
  useEffect(() => {
    mounted.current = true;
    loadContent();
    async function loadContent() {
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
          setContentObj({
            contentId,
            type
          });
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
    <ErrorBoundary>
      {loaded ? (
        exists ? (
          <ContentPanel
            key={contentObj.type + contentObj.contentId}
            autoExpand
            inputAtBottom={contentObj.type === 'comment'}
            commentsLoadLimit={5}
            contentObj={contentObj}
            userId={userId}
            onAttachStar={onAttachStar}
            onCommentSubmit={onCommentSubmit}
            onDeleteComment={onDeleteComment}
            onDeleteContent={() => history.push('/')}
            onEditComment={onEditComment}
            onEditContent={onEditContent}
            onEditRewardComment={onEditRewardComment}
            onLikeContent={onLikeContent}
            onLoadContent={onLoadContent}
            onLoadMoreComments={onLoadMoreComments}
            onLoadMoreReplies={onLoadMoreReplies}
            onLoadRepliesOfReply={onLoadRepliesOfReply}
            onReplySubmit={onReplySubmit}
            onSetDifficulty={onSetDifficulty}
            onShowComments={onShowComments}
            onTargetCommentSubmit={onTargetCommentSubmit}
          />
        ) : (
          <NotFound />
        )
      ) : (
        <Loading />
      )}
    </ErrorBoundary>
  );
}

export default connect(state => ({
  userId: state.UserReducer.userId
}))(Content);
