import request from 'axios';
import { auth, handleError } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import { push } from 'connected-react-router';
import LINK from '../constants/Link';

const API_URL = `${URL}/url`;

export const attachStar = data => ({
  type: LINK.ATTACH_STAR,
  data
});

export const likeComment = ({ commentId, likes }) => ({
  type: LINK.LIKE_COMMENT,
  data: { commentId, likes }
});

export const deleteComment = commentId => ({
  type: LINK.DELETE_COMMENT,
  commentId
});

export const deleteDiscussion = discussionId => ({
  type: LINK.DELETE_DISCUSSION,
  discussionId
});

export const deleteLink = linkId => async dispatch => {
  try {
    await request.delete(`${API_URL}?linkId=${linkId}`, auth());
    dispatch({
      type: LINK.DELETE,
      linkId
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const deleteLinkFromPage = linkId => async dispatch => {
  try {
    await request.delete(`${API_URL}/?linkId=${linkId}`, auth());
    dispatch(push('/links'));
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editComment = data => ({
  type: LINK.EDIT_COMMENT,
  ...data
});

export const editRewardComment = ({ id, text }) => ({
  type: LINK.EDIT_REWARD_COMMENT,
  id,
  text
});

export const editDiscussion = ({ editedDiscussion, discussionId }) => ({
  type: LINK.EDIT_DISCUSSION,
  data: editedDiscussion,
  discussionId
});

export const editLinkPage = params => async dispatch => {
  try {
    await request.put(`${API_URL}/page`, params, auth());
    dispatch({
      type: LINK.EDIT_PAGE,
      data: params
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editTitle = params => async dispatch => {
  try {
    await request.put(`${API_URL}/title`, params, auth());
    dispatch({
      type: LINK.EDIT_TITLE,
      data: params
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const fetchLinks = () => async dispatch => {
  try {
    const { data } = await request.get(API_URL);
    dispatch({
      type: LINK.LOAD,
      links: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const fetchMoreLinks = linkId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?linkId=${linkId}`);
    dispatch({
      type: LINK.LOAD_MORE,
      links: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const fetchComments = data => ({
  type: LINK.LOAD_COMMENTS,
  ...data
});

export const fetchMoreComments = data => ({
  type: LINK.LOAD_MORE_COMMENTS,
  ...data
});

export const fetchMoreReplies = ({ commentId, loadMoreButton, replies }) => ({
  type: LINK.LOAD_MORE_REPLIES,
  commentId,
  loadMoreButton,
  replies
});

export const fetchDiscussions = ({ results, loadMoreButton }) => ({
  type: LINK.LOAD_DISCUSSIONS,
  results,
  loadMoreButton
});

export const fetchMoreDiscussions = ({ results, loadMoreButton }) => ({
  type: LINK.LOAD_MORE_DISCUSSIONS,
  results,
  loadMoreButton
});

export const fetchDiscussionComments = ({ data, discussionId }) => ({
  type: LINK.LOAD_DISCUSSION_COMMENTS,
  discussionId,
  ...data
});

export const fetchMoreDiscussionReplies = ({
  commentId,
  loadMoreButton,
  replies
}) => ({
  type: LINK.LOAD_MORE_DISCUSSION_REPLIES,
  commentId,
  loadMoreButton,
  replies
});

export const fetchMoreDiscussionComments = ({ data, discussionId }) => ({
  type: LINK.LOAD_MORE_DISCUSSION_COMMENTS,
  discussionId,
  ...data
});

export const likeLink = likes => ({
  type: LINK.LIKE,
  likes
});

export const loadLinkPage = linkId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}/page?linkId=${linkId}`);
    dispatch({
      type: LINK.LOAD_PAGE,
      page: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
    return Promise.reject(error);
  }
};

export const resetPage = () => ({
  type: LINK.RESET_PAGE
});

export const setDiscussionDifficulty = ({ contentId, difficulty }) => ({
  type: LINK.SET_DISCUSSION_DIFFICULTY,
  contentId,
  difficulty
});

export const uploadComment = comment => ({
  type: LINK.UPLOAD_COMMENT,
  comment
});

export const uploadReply = reply => ({
  type: LINK.UPLOAD_REPLY,
  reply
});

export const uploadDiscussion = discussion => ({
  type: LINK.UPLOAD_DISCUSSION,
  discussion
});

export const uploadLink = ({ url, title, description }) => async dispatch => {
  try {
    const { data: linkItem } = await request.post(
      `${API_URL}`,
      { url, title, description },
      auth()
    );
    dispatch({
      type: LINK.UPLOAD,
      linkItem
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};
