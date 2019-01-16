import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import FEED from '../constants/Feed';

export const addTags = ({ type, contentId, tags }) => ({
  type: FEED.ADD_TAGS,
  contentId,
  contentType: type,
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

export const clearFeeds = () => ({
  type: FEED.CLEAR
});

export const contentFeedLike = ({ likes, contentId, type }) => ({
  type: FEED.LIKE_CONTENT,
  data: { contentId, type, likes }
});

export const feedCommentDelete = commentId => ({
  type: FEED.DELETE_COMMENT,
  commentId
});

export const feedContentDelete = ({ type, contentId }) => ({
  type: FEED.DELETE_CONTENT,
  contentType: type,
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

export const fetchFeed = ({ data, feedId }) => ({
  type: FEED.LOAD_DETAIL,
  feedId,
  data
});

export const fetchFeeds = ({
  filter = 'all',
  order = 'desc',
  orderBy = 'lastInteraction',
  username
} = {}) => async dispatch => {
  try {
    const { data } = await request.get(
      `${URL}/content/feeds?filter=${filter}&username=${username}&order=${order}&orderBy=${orderBy}`,
      auth()
    );
    dispatch({
      type: FEED.LOAD,
      data,
      filter
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

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
    const { data } = await request.get(
      `${URL}/content/feeds?filter=${filter}&username=${username}${
        shownFeeds ? `&${shownFeeds}` : ''
      }&order=${order}&orderBy=${orderBy}`,
      auth()
    );
    dispatch({
      type: FEED.LOAD_MORE,
      data,
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

export const loadTags = ({ type, contentId, tags }) => ({
  type: FEED.LOAD_TAGS,
  contentId,
  contentType: type,
  tags
});

export const setDifficulty = ({ type, contentId, difficulty }) => ({
  type: FEED.SET_DIFFICULTY,
  contentType: type,
  contentId,
  difficulty
});

export const setCurrentSection = section => ({
  type: FEED.SET_SECTION,
  section
});

export const showFeedComments = (data, feedId) => ({
  type: FEED.LOAD_COMMENTS,
  data,
  feedId
});

export const uploadFeedContent = data => ({
  type: FEED.UPLOAD_CONTENT,
  data
});

export const uploadFeedComment = ({ data, type, contentId }) => ({
  type: FEED.UPLOAD_COMMENT,
  comment: data,
  contentType: type,
  contentId
});

export const uploadTargetContentComment = (data, feedId) => ({
  type: FEED.UPLOAD_TC_COMMENT,
  data,
  feedId
});
