import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import FEED from '../constants/Feed';
import URL from 'constants/URL';

export const addTags = ({ contentType, contentId, tags }) => ({
  type: FEED.ADD_TAGS,
  contentId,
  contentType,
  tags
});

export const addTagToContents = ({
  contentIds,
  contentType,
  tagId,
  tagTitle
}) => ({
  type: FEED.ADD_TAG_TO_CONTENTS,
  contentIds,
  contentType,
  tag: { id: tagId, title: tagTitle }
});

export const attachStar = data => ({
  type: FEED.ATTACH_STAR,
  data
});

export const changeByUserStatus = ({ contentId, byUser }) => ({
  type: FEED.CHANGE_BY_USER_STATUS,
  contentId,
  byUser
});

export const changeCategory = category => ({
  type: FEED.CHANGE_CATEGORY,
  category
});

export const changeSpoilerStatus = ({ shown, subjectId }) => ({
  type: FEED.CHANGE_SPOILER_STATUS,
  shown,
  subjectId
});

export const changeSubFilter = filter => ({
  type: FEED.CHANGE_SUB_FILTER,
  filter
});

export const contentFeedLike = ({ likes, contentId, contentType }) => ({
  type: FEED.LIKE_CONTENT,
  data: { contentId, contentType, likes }
});

export const feedCommentDelete = commentId => ({
  type: FEED.DELETE_COMMENT,
  commentId
});

export const feedContentDelete = ({ contentType, contentId }) => ({
  type: FEED.DELETE_CONTENT,
  contentType,
  contentId
});

export const feedCommentEdit = ({ editedComment, commentId }) => ({
  type: FEED.EDIT_COMMENT,
  commentId,
  editedComment
});

export const feedContentEdit = ({ data, contentType, contentId }) => ({
  type: FEED.EDIT_CONTENT,
  data,
  contentType,
  contentId
});

export const feedRewardCommentEdit = ({ id, text }) => ({
  type: FEED.EDIT_REWARD_COMMENT,
  id,
  text
});

export const fetchFeed = data => ({
  type: FEED.LOAD_DETAIL,
  data
});

export const fetchFeeds = ({ feeds, loadMoreButton }) => ({
  type: FEED.LOAD,
  feeds,
  loadMoreButton
});

export const fetchNewFeeds = data => ({
  type: FEED.LOAD_NEW,
  data
});

export const fetchMoreFeeds = ({
  shownFeeds,
  filter,
  order = 'desc',
  orderBy = 'lastInteraction',
  username
}) => async dispatch => {
  try {
    const {
      data: { feeds, loadMoreButton }
    } = await request.get(
      `${URL}/content/feeds?filter=${filter}&username=${username}${
        shownFeeds ? `&${shownFeeds}` : ''
      }&order=${order}&orderBy=${orderBy}`,
      auth()
    );
    dispatch({
      type: FEED.LOAD_MORE,
      feeds,
      loadMoreButton,
      filter
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMoreFeedComments = ({ data, contentType, feedId }) => ({
  type: FEED.LOAD_MORE_COMMENTS,
  contentType,
  feedId,
  data
});

export const loadMoreFeedReplies = (data, feedId) => ({
  type: FEED.LOAD_MORE_REPLIES,
  feedId,
  data
});

export const loadRepliesOfReply = ({ replies, commentId, replyId }) => ({
  type: FEED.LOAD_REPLIES_OF_REPLY,
  replies,
  commentId,
  replyId
});

export const loadTags = ({ contentType, contentId, tags }) => ({
  type: FEED.LOAD_TAGS,
  contentId,
  contentType,
  tags
});

export const showFeedComments = ({ feedId, shown }) => ({
  type: FEED.SHOW_COMMENTS,
  feedId,
  shown
});

export const showTCReplyInput = feedId => ({
  type: FEED.SHOW_TC_REPLY_INPUT,
  feedId
});

export const setRewardLevel = ({ contentType, contentId, rewardLevel }) => ({
  type: FEED.SET_REWARD_LEVEL,
  contentType,
  contentId,
  rewardLevel
});

export const setCurrentSection = section => ({
  type: FEED.SET_SECTION,
  section
});

export const loadFeedComments = (data, feedId) => ({
  type: FEED.LOAD_COMMENTS,
  data,
  feedId
});

export const uploadFeedContent = data => ({
  type: FEED.UPLOAD_CONTENT,
  data
});

export const uploadFeedComment = ({ data, contentType, contentId }) => ({
  type: FEED.UPLOAD_COMMENT,
  comment: data,
  contentType,
  contentId
});

export const uploadTargetContentComment = (data, feedId) => ({
  type: FEED.UPLOAD_TC_COMMENT,
  data,
  feedId
});
