import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import ErrorBoundary from 'components/Wrappers/ErrorBoundary';
import Heading from './Heading';
import Loading from 'components/Loading';
import ContentListItem from 'components/ContentListItem';
import Body from './Body';
import TargetContent from './TargetContent';
import Embedly from 'components/Embedly';
import Profile from './Profile';
import { css } from 'emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { container } from './Styles';
import { useContentState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { withRouter } from 'react-router';
import { useInView } from 'react-intersection-observer';

ContentPanel.propTypes = {
  autoExpand: PropTypes.bool,
  commentsLoadLimit: PropTypes.number,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  numPreviewComments: PropTypes.number,
  style: PropTypes.object
};

function ContentPanel({
  autoExpand,
  commentsLoadLimit,
  contentId,
  contentType,
  history,
  numPreviewComments = 0,
  style = {}
}) {
  const {
    requestHelpers: { loadContent }
  } = useAppContext();
  const {
    actions: {
      onAddTags,
      onAddTagToContents,
      onAttachStar,
      onChangeSpoilerStatus,
      onDeleteComment,
      onDeleteContent,
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
      onSetPlaceholderHeight,
      onSetRewardLevel,
      onSetVisible,
      onShowTCReplyInput,
      onUploadTargetComment,
      onUploadComment,
      onUploadReply
    }
  } = useContentContext();
  const contentState = useContentState({ contentType, contentId });
  const [videoShown, setVideoShown] = useState(false);
  const [commentsHidden, setCommentsHidden] = useState(true);
  const mounted = useRef(true);
  const loading = useRef(false);
  const ActualPanelRef = useRef(null);
  const prevInView = useRef(false);
  const timerRef = useRef(null);
  const inputAtBottom = contentType === 'comment';
  const [ContentPanelRef, inView] = useInView({
    threshold: 0
  });
  const {
    commentId,
    commentsShown,
    loaded,
    newPost,
    rootType,
    targetObj,
    visible
  } = contentState;
  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      onSetVisible({
        contentId,
        contentType,
        visible: false
      });
      clearTimeout(timerRef.current);
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (!loaded && !loading.current && contentId) {
      onMount();
    }
    async function onMount() {
      if (!newPost) {
        loading.current = true;
        const data = await loadContent({ contentId, contentType });
        if (mounted.current) {
          onInitContent({
            ...data,
            feedId: contentState.feedId
          });
          if (data.rootObj) {
            onInitContent({
              contentId: data.rootId,
              contentType: data.rootType,
              ...data.rootObj
            });
          }
          loading.current = false;
        }
      }
    }
  }, [contentState]);

  useEffect(() => {
    if (!prevInView.current && inView) {
      if (ActualPanelRef.current?.clientHeight) {
        onSetPlaceholderHeight({
          contentType,
          contentId,
          height: ActualPanelRef.current.clientHeight
        });
      }
    }
    if (inView) {
      onSetVisible({
        contentId,
        contentType,
        visible: true
      });
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSetVisible({
          contentId,
          contentType,
          visible: false
        });
      }, 5000);
    }
    prevInView.current = inView;
    return function onRefresh() {
      if (inView) {
        clearTimeout(timerRef.current);
      }
      if (ActualPanelRef.current?.clientHeight) {
        onSetPlaceholderHeight({
          contentType,
          contentId,
          height: ActualPanelRef.current.clientHeight
        });
      }
    };
  }, [inView]);

  return useMemo(
    () =>
      !contentState.deleted ? (
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
            <div ref={ContentPanelRef}>
              {inView || visible ? (
                <div
                  ref={ActualPanelRef}
                  style={{
                    height: !loaded && '15rem',
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
                    {!loaded && <Loading />}
                    {loaded && (
                      <>
                        <Heading
                          contentObj={contentState}
                          action={
                            commentId
                              ? targetObj.comment.notFound
                                ? 'replied on'
                                : 'replied to'
                              : rootType === 'subject'
                              ? 'responded to'
                              : rootType === 'user'
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
                            commentsShown={commentsShown}
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
                  {loaded && targetObj?.comment && (
                    <TargetContent
                      style={{
                        position: 'relative',
                        zIndex: 2
                      }}
                      targetObj={targetObj}
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
                          history.push(
                            `/subjects/${contentState.targetObj.subject.id}`
                          )
                        }
                        contentObj={contentState.targetObj.subject}
                        onChangeSpoilerStatus={onChangeSpoilerStatus}
                      />
                    </div>
                  )}
                  {contentType === 'comment' &&
                    contentState.rootType === 'video' && (
                      <ContentListItem
                        style={{
                          position: 'relative'
                        }}
                        expandable
                        onClick={() =>
                          history.push(`/videos/${contentState.rootObj.id}`)
                        }
                        contentObj={contentState.rootObj}
                      />
                    )}
                  {(contentType === 'comment' || contentType === 'subject') &&
                    contentState.rootType === 'url' && (
                      <div
                        className={css`
                          padding: 1rem;
                          background: ${Color.whiteGray()};
                          border: 1px solid ${Color.borderGray()};
                          border-radius: ${borderRadius};
                          margin-top: -1rem;
                          transition: background 0.5s;
                          &:hover {
                            background: #fff;
                          }
                          @media (max-width: ${mobileMaxWidth}) {
                            margin-top: -0.5rem;
                          }
                        `}
                      >
                        <Embedly small contentId={contentState.rootId} />
                      </div>
                    )}
                  {contentType === 'comment' &&
                    contentState.rootType === 'user' && (
                      <div
                        className={css`
                          cursor: pointer;
                          background: ${Color.whiteGray()};
                          border: 1px solid ${Color.borderGray()};
                          border-radius: ${borderRadius};
                          margin-top: -1rem;
                          transition: background 0.5s;
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
                          history.push(
                            `/users/${contentState.rootObj.username}`
                          )
                        }
                      >
                        <Profile profile={contentState.rootObj} />
                      </div>
                    )}
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    margin: '1rem 0 1rem 0',
                    height: contentState.placeholderHeight || '20rem'
                  }}
                />
              )}
            </div>
          </ErrorBoundary>
        </Context.Provider>
      ) : null,
    [commentsHidden, contentState, inView, visible]
  );
}

export default memo(withRouter(ContentPanel));
