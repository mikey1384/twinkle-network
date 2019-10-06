import PropTypes from 'prop-types';
import React, { memo, useEffect, useRef, useState } from 'react';
import Context from './Context';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Heading from './Heading';
import Body from './Body';
import Loading from 'components/Loading';
import ContentListItem from 'components/ContentListItem';
import TargetContent from './TargetContent';
import Embedly from 'components/Embedly';
import Profile from './Profile';
import { css } from 'emotion';
import { cleanString } from 'helpers/stringHelpers';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { container } from './Styles';
import { useAppContext, useContentContext } from 'contexts';
import { withRouter } from 'react-router';

ContentPanel.propTypes = {
  autoExpand: PropTypes.bool,
  commentsLoadLimit: PropTypes.number,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  numPreviewComments: PropTypes.number,
  onDeleteContent: PropTypes.func.isRequired,
  style: PropTypes.object
};

function ContentPanel({
  autoExpand,
  commentsLoadLimit,
  contentId,
  contentType,
  history,
  numPreviewComments = 0,
  onDeleteContent,
  style = {}
}) {
  const {
    requestHelpers: { loadContent }
  } = useAppContext();
  const {
    state: { [contentType + contentId]: contentState = {} },
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
  } = useContentContext();
  const [urlMouseEntered, setUrlMouseEntered] = useState(false);
  const [profileMouseEntered, setProfileMouseEntered] = useState(false);
  const [videoShown, setVideoShown] = useState(false);
  const [commentsHidden, setCommentsHidden] = useState(true);
  const mounted = useRef(true);
  const loading = useRef(false);
  const inputAtBottom = contentType === 'comment';
  useEffect(() => {
    mounted.current = true;
    if (!contentState.loaded && !loading.current && contentId) {
      onMount();
    }
    async function onMount() {
      if (!contentState.newPost) {
        loading.current = true;
        const data = await loadContent({ contentId, contentType });
        if (mounted.current) {
          onInitContent({
            ...data,
            loaded: true,
            feedId: contentState.feedId
          });
          loading.current = false;
        }
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [contentState.loaded]);

  return (
    <Context.Provider
      value={{
        commentsLoadLimit,
        onAddTags,
        onAddTagToContents,
        onAttachStar,
        onByUserStatusChange: onSetByUserStatus,
        onCommentSubmit: onUploadComment,
        onDeleteComment,
        onDeleteContent,
        onEditComment,
        onEditContent,
        onEditRewardComment,
        onLoadComments,
        onLikeContent,
        onLoadMoreComments,
        onLoadMoreReplies,
        onLoadTags,
        onLoadRepliesOfReply,
        onReplySubmit: onUploadReply,
        onSetCommentsHidden: setCommentsHidden,
        onSetCommentsShown,
        onSetRewardLevel,
        onUploadTargetComment
      }}
    >
      <ErrorBoundary>
        <div
          style={{
            height: !contentState.loaded && '15rem',
            position: 'relative',
            ...style
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 3
            }}
            className={container}
          >
            {!contentState.loaded && <Loading />}
            {contentState.loaded && (
              <>
                <Heading
                  contentObj={contentState}
                  action={
                    contentState.commentId
                      ? contentState.targetObj.comment.notFound
                        ? 'replied on'
                        : 'replied to'
                      : contentState.rootType === 'subject'
                      ? 'responded to'
                      : contentState.rootType === 'user'
                      ? 'left a message to'
                      : 'commented on'
                  }
                  onPlayVideoClick={() => setVideoShown(true)}
                  attachedVideoShown={videoShown}
                />
                <div className="body">
                  <Body
                    autoExpand={autoExpand}
                    commentsHidden={commentsHidden}
                    commentsShown={contentState.commentsShown}
                    contentObj={contentState}
                    inputAtBottom={inputAtBottom}
                    attachedVideoShown={videoShown}
                    numPreviewComments={numPreviewComments}
                    onChangeSpoilerStatus={onChangeSpoilerStatus}
                  />
                </div>
              </>
            )}
          </div>
          {contentState.loaded && contentState.targetObj?.comment && (
            <TargetContent
              style={{
                position: 'relative',
                zIndex: 2
              }}
              targetObj={contentState.targetObj}
              rootObj={contentState.rootObj}
              rootId={contentState.rootId}
              rootType={contentState.rootType}
              contentId={contentId}
              contentType={contentType}
              onShowTCReplyInput={onShowTCReplyInput}
            />
          )}
          {contentState.loaded && contentState.targetObj?.subject && (
            <div>
              <ContentListItem
                comments={contentState.childComments}
                style={{
                  zIndex: 1,
                  position: 'relative'
                }}
                expandable
                onClick={() =>
                  history.push(`/subjects/${contentState.targetObj.subject.id}`)
                }
                contentObj={contentState.targetObj.subject}
                onChangeSpoilerStatus={onChangeSpoilerStatus}
              />
            </div>
          )}
          {contentType === 'comment' && contentState.rootType === 'video' && (
            <ContentListItem
              style={{
                position: 'relative'
              }}
              expandable
              onClick={() => history.push(`/videos/${contentState.rootObj.id}`)}
              contentObj={contentState.rootObj}
            />
          )}
          {(contentType === 'comment' || contentType === 'subject') &&
            contentState.rootType === 'url' && (
              <div
                onTouchStart={() => setUrlMouseEntered(true)}
                onMouseEnter={() => setUrlMouseEntered(true)}
                className={css`
                  padding: 1rem;
                  background: ${Color.whiteGray()};
                  margin-top: ${urlMouseEntered ? '-0.5rem' : '-2rem'};
                  border: 1px solid ${Color.borderGray()};
                  border-radius: ${borderRadius};
                  transition: margin-top 0.5s, background 0.5s;
                  &:hover {
                    background: #fff;
                  }
                  @media (max-width: ${mobileMaxWidth}) {
                    margin-top: -0.5rem;
                  }
                `}
              >
                <Embedly
                  small
                  title={cleanString(contentState.rootObj.title)}
                  url={contentState.rootObj.content}
                  contentId={contentState.rootId}
                  thumbUrl={contentState.rootObj.thumbUrl}
                  actualTitle={contentState.rootObj.actualTitle}
                  actualDescription={contentState.rootObj.actualDescription}
                  siteUrl={contentState.rootObj.siteUrl}
                />
              </div>
            )}
          {contentType === 'comment' && contentState.rootType === 'user' && (
            <div
              onTouchStart={() => setProfileMouseEntered(true)}
              onMouseEnter={() => setProfileMouseEntered(true)}
              className={css`
                cursor: pointer;
                background: ${Color.whiteGray()};
                margin-top: ${profileMouseEntered ? '-0.5rem' : '-2rem'};
                border: 1px solid ${Color.borderGray()};
                border-radius: ${borderRadius};
                transition: margin-top 0.5s, background 0.5s;
                padding-bottom: 1rem;
                &:hover {
                  background: #fff;
                }
                @media (max-width: ${mobileMaxWidth}) {
                  border-left: 0;
                  border-right: 0;
                  margin-top: -0.5rem;
                }
              `}
              onClick={() =>
                window.open(`/users/${contentState.rootObj.username}`)
              }
            >
              <Profile profile={contentState.rootObj} />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Context.Provider>
  );
}

export default withRouter(memo(ContentPanel));
