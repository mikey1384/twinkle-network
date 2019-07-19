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
  match: {
    params: { contentId },
    url
  },
  userId
}) {
  const type = url.split('/')[1].slice(0, -1);
  const {
    contentObj,
    onAttachStar,
    onChangeSpoilerStatus,
    onDeleteComment,
    onEditComment,
    onEditRewardComment,
    onEditContent,
    onInitContent,
    onLikeContent,
    onLoadComments,
    onLoadMoreComments,
    onLoadMoreReplies,
    onLoadRepliesOfReply,
    onSetDifficulty,
    onTargetCommentSubmit,
    onUploadComment,
    onUploadReply
  } = useContentObj({ contentId, type });
  const [{ loaded, exists }, setContentStatus] = useState({
    loaded: false,
    exists: false
  });
  const mounted = useRef(null);
  useEffect(() => {
    mounted.current = true;
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
          onInitContent({
            content: {
              contentId,
              type
            }
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
            onSetDifficulty={onSetDifficulty}
            onShowComments={onLoadComments}
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
