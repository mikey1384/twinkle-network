import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import MonthlyXp from './MonthlyXp';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import {
  loadNotableContent,
  loadMoreNotableContents
} from 'helpers/requestHelpers';
import { Context } from 'context';

Achievements.propTypes = {
  profile: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string,
  myId: PropTypes.number
};

export default function Achievements({
  profile,
  profile: { id, username },
  myId,
  selectedTheme
}) {
  const {
    profile: {
      state: {
        notables: { feeds, loadMoreButton }
      },
      actions: { onDeleteFeed, onLoadNotables, onLoadMoreNotables }
    },
    content: {
      state,
      actions: {
        onAddTags,
        onAddTagToContents,
        onAttachStar,
        onChangeSpoilerStatus,
        onDeleteComment,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onInitContent,
        onLikeContent,
        onLoadComments,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadRepliesOfReply,
        onLoadTags,
        onSetByUserStatus,
        onSetCommentsShown,
        onSetRewardLevel,
        onShowTCReplyInput,
        onUploadTargetComment,
        onUploadComment,
        onUploadReply
      }
    }
  } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    initNotables();
    async function initNotables() {
      const { results, loadMoreButton } = await loadNotableContent({
        userId: id
      });
      if (mounted.current) {
        onLoadNotables({ feeds: results, loadMoreButton });
        setLoading(false);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [profile.id]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title="Notable Activities"
        loaded={!loading}
      >
        {feeds.length === 0 && (
          <div
            style={{ fontSize: '2rem', textAlign: 'center' }}
          >{`${username} hasn't engaged in an activity worth showing here, yet`}</div>
        )}
        {feeds.map((notable, index) => {
          const contentKey = notable?.contentType + notable?.contentId;
          const contentState = state[contentKey] || {
            contentId: notable?.contentId,
            contentType: notable?.contentType
          };
          return (
            <ContentPanel
              key={contentKey}
              style={{ marginBottom: '1rem', zIndex: feeds.length - index }}
              inputAtBottom={contentState.contentType === 'comment'}
              commentsLoadLimit={5}
              contentObj={contentState}
              userId={myId}
              onAddTags={onAddTags}
              onAddTagToContents={onAddTagToContents}
              onByUserStatusChange={onSetByUserStatus}
              onAttachStar={onAttachStar}
              onChangeSpoilerStatus={onChangeSpoilerStatus}
              onCommentSubmit={onUploadComment}
              onDeleteComment={onDeleteComment}
              onDeleteContent={onDeleteFeed}
              onEditComment={onEditComment}
              onEditContent={onEditContent}
              onEditRewardComment={onEditRewardComment}
              onLikeContent={onLikeContent}
              onInitContent={onInitContent}
              onLoadMoreComments={onLoadMoreComments}
              onLoadMoreReplies={onLoadMoreReplies}
              onLoadRepliesOfReply={onLoadRepliesOfReply}
              onLoadTags={onLoadTags}
              onReplySubmit={onUploadReply}
              onSetCommentsShown={onSetCommentsShown}
              onShowTCReplyInput={onShowTCReplyInput}
              onSetRewardLevel={onSetRewardLevel}
              onShow
              onLoadComments={onLoadComments}
              onUploadTargetComment={onUploadTargetComment}
            />
          );
        })}
        {loadMoreButton && (
          <LoadMoreButton
            style={{ fontSize: '1.7rem' }}
            label="Show More"
            transparent
            onClick={handleLoadMoreNotables}
          />
        )}
      </SectionPanel>
      <MonthlyXp selectedTheme={selectedTheme} userId={id} />
    </ErrorBoundary>
  );

  async function handleLoadMoreNotables() {
    const { results, loadMoreButton } = await loadMoreNotableContents({
      userId: profile.id,
      notables: feeds
    });
    onLoadMoreNotables({ feeds: results, loadMoreButton });
  }
}
