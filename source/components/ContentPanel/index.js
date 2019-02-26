import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Context from './Context';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Heading from './Heading';
import Body from './Body';
import Loading from 'components/Loading';
import { container } from './Styles';
import request from 'axios';
import URL from 'constants/URL';

ContentPanel.propTypes = {
  autoExpand: PropTypes.bool,
  commentsLoadLimit: PropTypes.number,
  contentObj: PropTypes.object.isRequired,
  inputAtBottom: PropTypes.bool,
  userId: PropTypes.number,
  onAddTags: PropTypes.func,
  onAddTagToContents: PropTypes.func,
  onAttachStar: PropTypes.func.isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  onDeleteContent: PropTypes.func.isRequired,
  onEditComment: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
  onEditRewardComment: PropTypes.func.isRequired,
  onLikeContent: PropTypes.func.isRequired,
  onLoadContent: PropTypes.func,
  onLoadMoreComments: PropTypes.func.isRequired,
  onLoadMoreReplies: PropTypes.func.isRequired,
  onLoadTags: PropTypes.func,
  onLoadRepliesOfReply: PropTypes.func,
  onReplySubmit: PropTypes.func.isRequired,
  onSetDifficulty: PropTypes.func,
  onShowComments: PropTypes.func.isRequired,
  onByUserStatusChange: PropTypes.func,
  onTargetCommentSubmit: PropTypes.func.isRequired
};

export default function ContentPanel({
  autoExpand,
  commentsLoadLimit,
  contentObj,
  contentObj: { contentId, feedId, newPost, type },
  inputAtBottom,
  onAddTags,
  onAddTagToContents,
  onAttachStar,
  onByUserStatusChange,
  onCommentSubmit,
  onDeleteComment,
  onDeleteContent,
  onEditComment,
  onEditContent,
  onEditRewardComment,
  onLikeContent,
  onLoadContent,
  onLoadMoreComments,
  onLoadMoreReplies,
  onLoadTags,
  onLoadRepliesOfReply,
  onReplySubmit,
  onSetDifficulty,
  onShowComments,
  onTargetCommentSubmit,
  userId
}) {
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    onMount();
    async function onMount() {
      if (!loaded && !newPost) {
        setLoaded(true);
        const { data } = await request.get(
          `${URL}/content?contentId=${contentId}&type=${type}`
        );
        if (mounted.current) {
          onLoadContent({ content: data, feedId });
        }
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);
  const [videoShown, setVideoShown] = useState(false);
  return (
    <Context.Provider
      value={{
        commentsLoadLimit,
        onAddTags,
        onAddTagToContents,
        onAttachStar,
        onByUserStatusChange,
        onCommentSubmit,
        onDeleteComment,
        onDeleteContent,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onLikeContent,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadTags,
        onLoadRepliesOfReply,
        onReplySubmit,
        onSetDifficulty,
        onShowComments,
        onTargetCommentSubmit
      }}
    >
      <ErrorBoundary
        className={container}
        style={{ height: !contentObj.loaded && '15rem' }}
      >
        {!contentObj.loaded && <Loading />}
        {contentObj.loaded && (
          <Heading
            contentObj={contentObj}
            myId={userId}
            action={
              contentObj.commentId
                ? contentObj.targetObj.comment.notFound
                  ? 'replied on'
                  : 'replied to'
                : contentObj.rootType === 'subject'
                ? 'responded to'
                : contentObj.rootType === 'user'
                ? 'left a message to'
                : 'commented on'
            }
            onPlayVideoClick={() => setVideoShown(true)}
            attachedVideoShown={videoShown}
          />
        )}
        <div className="body">
          {contentObj.loaded && (
            <Body
              autoExpand={autoExpand}
              contentObj={contentObj}
              inputAtBottom={inputAtBottom}
              attachedVideoShown={videoShown}
              myId={userId}
            />
          )}
        </div>
      </ErrorBoundary>
    </Context.Provider>
  );
}
