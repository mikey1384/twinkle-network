import React, { Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import FilterBar from 'components/FilterBar';
import ContentPanel from 'components/ContentPanel';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { useInfiniteScroll } from 'helpers/hooks';
import { loadFeeds } from 'helpers/requestHelpers';
import { queryStringForArray } from 'helpers/stringHelpers';
import {
  addTags,
  addTagToContents,
  attachStar,
  changeByUserStatus,
  changeSpoilerStatus,
  contentFeedLike,
  feedCommentDelete,
  feedCommentEdit,
  feedContentDelete,
  feedContentEdit,
  feedRewardCommentEdit,
  fetchFeed,
  fetchFeeds,
  fetchMoreFeeds,
  loadMoreFeedComments,
  loadMoreFeedReplies,
  loadRepliesOfReply,
  loadTags,
  setCurrentSection,
  setRewardLevel,
  showFeedComments,
  uploadFeedComment,
  uploadTargetContentComment
} from 'redux/actions/FeedActions';
import Loading from 'components/Loading';
import SideMenu from './SideMenu';
import { connect } from 'react-redux';

Posts.propTypes = {
  addTags: PropTypes.func.isRequired,
  addTagToContents: PropTypes.func.isRequired,
  attachStar: PropTypes.func.isRequired,
  changeByUserStatus: PropTypes.func.isRequired,
  changeSpoilerStatus: PropTypes.func.isRequired,
  contentFeedLike: PropTypes.func.isRequired,
  fetchFeed: PropTypes.func.isRequired,
  feedCommentDelete: PropTypes.func.isRequired,
  feedContentDelete: PropTypes.func.isRequired,
  feedCommentEdit: PropTypes.func.isRequired,
  feedContentEdit: PropTypes.func.isRequired,
  feedRewardCommentEdit: PropTypes.func.isRequired,
  fetchFeeds: PropTypes.func.isRequired,
  fetchMoreFeeds: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool.isRequired,
  loadMoreButton: PropTypes.bool.isRequired,
  loadMoreFeedComments: PropTypes.func.isRequired,
  loadMoreFeedReplies: PropTypes.func.isRequired,
  loadRepliesOfReply: PropTypes.func.isRequired,
  loadTags: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  myId: PropTypes.number,
  profileFeeds: PropTypes.array.isRequired,
  searchMode: PropTypes.bool.isRequired,
  selectedTheme: PropTypes.string,
  setCurrentSection: PropTypes.func.isRequired,
  setRewardLevel: PropTypes.func,
  showFeedComments: PropTypes.func.isRequired,
  uploadTargetContentComment: PropTypes.func.isRequired,
  uploadFeedComment: PropTypes.func.isRequired
};

const filterTable = {
  all: 'all',
  comments: 'comment',
  likes: 'like',
  posts: 'post',
  videos: 'video',
  links: 'url'
};

function Posts({
  addTags,
  addTagToContents,
  attachStar,
  changeByUserStatus,
  changeSpoilerStatus,
  contentFeedLike,
  feedCommentDelete,
  feedContentDelete,
  feedCommentEdit,
  feedContentEdit,
  feedRewardCommentEdit,
  fetchFeed,
  fetchFeeds,
  fetchMoreFeeds,
  history,
  loadMoreFeedComments,
  loadMoreFeedReplies,
  loaded,
  loadMoreButton,
  loadRepliesOfReply,
  loadTags,
  location,
  match: {
    params: { section, username }
  },
  myId,
  profileFeeds,
  searchMode,
  selectedTheme,
  setCurrentSection,
  showFeedComments,
  uploadFeedComment,
  uploadTargetContentComment,
  setRewardLevel
}) {
  const [loading, setLoading] = useState(false);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const mounted = useRef(true);
  const selectedFilter = useRef('all');

  const [setScrollHeight] = useInfiniteScroll({
    scrollable: !searchMode && profileFeeds.length > 0,
    loadable: loadMoreButton,
    loading,
    onScrollToBottom: () => setLoading(true),
    onLoad: loadMoreFeeds
  });

  useEffect(() => {
    mounted.current = true;
    setCurrentSection('profileFeeds');
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (history.action === 'PUSH' || profileFeeds.length === 0) {
      loadTab(section);
    }
  }, [location]);

  return !loaded ? (
    <Loading style={{ marginBottom: '50vh' }} text="Loading..." />
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FilterBar
        color={selectedTheme}
        style={{ height: '5rem' }}
        className="mobile"
      >
        {[
          { key: 'all', label: 'All' },
          { key: 'post', label: 'Subjects' },
          { key: 'video', label: 'Videos' },
          { key: 'url', label: 'Links' }
        ].map(type => {
          return (
            <nav
              key={type.key}
              className={filterTable[section] === type.key ? 'active' : ''}
              onClick={() => onClickPostsMenu({ item: type.key })}
            >
              {type.label}
            </nav>
          );
        })}
      </FilterBar>
      <div
        className={css`
          width: ${section === 'likes' ? '65vw' : '80vw'};
          display: flex;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100vw;
          }
        `}
      >
        {loadingFeeds ? (
          <Loading
            className={css`
              width: ${section === 'likes' ? '100%' : 'CALC(100% - 25rem)'};
              @media (max-width: ${mobileMaxWidth}) {
                width: 100%;
              }
            `}
            text="Loading..."
          />
        ) : (
          <div
            className={css`
              width: ${section === 'likes' ? '100%' : 'CALC(100% - 25rem)'};
              @media (max-width: ${mobileMaxWidth}) {
                width: 100%;
              }
            `}
          >
            {profileFeeds.length > 0 &&
              profileFeeds.map((feed, index) => {
                return (
                  <ContentPanel
                    key={filterTable[section] + feed.feedId}
                    style={{
                      marginBottom: '1rem',
                      zIndex: profileFeeds.length - index
                    }}
                    commentsLoadLimit={5}
                    contentObj={feed}
                    inputAtBottom={feed.type === 'comment'}
                    onInitContent={fetchFeed}
                    onAddTags={addTags}
                    onAddTagToContents={addTagToContents}
                    onAttachStar={attachStar}
                    onByUserStatusChange={changeByUserStatus}
                    onChangeSpoilerStatus={changeSpoilerStatus}
                    onCommentSubmit={data =>
                      handleUploadFeedComment({ feed, data })
                    }
                    onDeleteComment={feedCommentDelete}
                    onDeleteContent={feedContentDelete}
                    onEditComment={feedCommentEdit}
                    onEditContent={feedContentEdit}
                    onEditRewardComment={feedRewardCommentEdit}
                    onLikeContent={contentFeedLike}
                    onLoadMoreComments={loadMoreFeedComments}
                    onLoadMoreReplies={loadMoreFeedReplies}
                    onLoadRepliesOfReply={loadRepliesOfReply}
                    onLoadTags={loadTags}
                    onReplySubmit={data =>
                      handleUploadFeedComment({ feed, data })
                    }
                    onSetRewardLevel={setRewardLevel}
                    onShowComments={showFeedComments}
                    onTargetCommentSubmit={uploadTargetContentComment}
                    userId={myId}
                  />
                );
              })}
            {profileFeeds.length === 0 && (
              <div
                style={{
                  marginTop: '6rem',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{ textAlign: 'center' }}>{onNoFeed(username)}</div>
              </div>
            )}
            {loadMoreButton && (
              <LoadMoreButton
                style={{ marginBottom: '1rem' }}
                onClick={loadMoreFeeds}
                loading={loading}
                color="lightBlue"
                filled
              />
            )}
          </div>
        )}
        {section !== 'likes' && (
          <Suspense fallback={<Loading />}>
            <SideMenu
              className={`desktop ${css`
                width: 30rem;
              `}`}
              menuItems={[
                { key: 'all', label: 'All' },
                { key: 'comment', label: 'Comments' },
                { key: 'post', label: 'Subjects' },
                { key: 'video', label: 'Videos' },
                { key: 'url', label: 'Links' }
              ]}
              onMenuClick={onClickPostsMenu}
              selectedKey={filterTable[section]}
            />
          </Suspense>
        )}
      </div>
    </div>
  );

  async function loadMoreFeeds() {
    try {
      await fetchMoreFeeds({
        shownFeeds: queryStringForArray({
          array: profileFeeds,
          originVar: section === 'likes' ? 'likeId' : 'feedId',
          destinationVar: 'shownFeeds'
        }),
        filter: filterTable[section],
        username
      });
      if (mounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadTab(tabName) {
    selectedFilter.current = filterTable[tabName];
    setLoadingFeeds(true);
    const { data, filter: loadedFilter } = await loadFeeds({
      username,
      filter: filterTable[tabName]
    });
    if (loadedFilter === selectedFilter.current) {
      fetchFeeds(data);
      setScrollHeight(0);
      setLoadingFeeds(false);
    }
  }

  function onClickPostsMenu({ item }) {
    history.push(
      `/users/${username}/${item === 'url' ? 'link' : item}${
        item === 'all' ? '' : 's'
      }`
    );
  }

  function onNoFeed(username) {
    switch (section) {
      case 'all':
        return `${username} has not uploaded anything, yet`;
      case 'posts':
        return `${username} has not uploaded a subject, yet`;
      case 'comments':
        return `${username} has not uploaded a comment, yet`;
      case 'links':
        return `${username} has not uploaded a link, yet`;
      case 'videos':
        return `${username} has not uploaded a video, yet`;
      case 'likes':
        return `${username} doesn't like any content so far`;
    }
  }

  function handleUploadFeedComment({ feed, data }) {
    uploadFeedComment({
      data,
      type: feed.type,
      contentId: feed.contentId
    });
  }
}

export default connect(
  state => ({
    profileFeeds: state.FeedReducer.profileFeeds,
    loaded: state.FeedReducer.loaded,
    myId: state.UserReducer.userId,
    loadMoreButton: state.FeedReducer.profileFeedsLoadMoreButton,
    homeComponentConnected: state.FeedReducer.homeComponentConnected,
    searchMode: state.SearchReducer.searchMode
  }),
  {
    addTags,
    addTagToContents,
    attachStar,
    changeByUserStatus,
    changeSpoilerStatus,
    contentFeedLike,
    fetchFeed,
    fetchFeeds,
    fetchMoreFeeds,
    feedCommentDelete,
    feedContentDelete,
    feedCommentEdit,
    feedContentEdit,
    feedRewardCommentEdit,
    loadMoreFeedComments,
    loadMoreFeedReplies,
    loadRepliesOfReply,
    loadTags,
    setCurrentSection,
    setRewardLevel,
    showFeedComments,
    uploadFeedComment,
    uploadTargetContentComment
  }
)(Posts);
