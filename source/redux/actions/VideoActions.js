import request from 'axios';
import { push } from 'react-router-redux';
import { likePlaylistVideo } from './PlaylistActions';
import { auth, handleError } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import VIDEO from '../constants/Video';

const API_URL = `${URL}/video`;

export const attachStar = data => ({
  type: VIDEO.ATTACH_STAR,
  data
});

export const getInitialVideos = () => async dispatch => {
  try {
    const { data } = await request.get(API_URL);
    dispatch({
      type: VIDEO.LOAD,
      initialRun: true,
      videos: data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const addVideoView = params => dispatch => {
  try {
    request.post(`${API_URL}/view`, params);
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const closeAddVideoModal = () => ({
  type: VIDEO.CLOSE_MODAL
});

export const deleteVideo = ({
  videoId,
  arrayIndex,
  lastVideoId
}) => async dispatch => {
  try {
    const { data } = await request.delete(
      `${API_URL}?videoId=${videoId}&lastVideoId=${lastVideoId}`,
      auth()
    );
    if (!lastVideoId) {
      dispatch(getInitialVideos());
      dispatch(push('/videos'));
    } else {
      dispatch({
        type: VIDEO.DELETE,
        arrayIndex,
        data: data.result
      });
    }
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const deleteVideoComment = commentId => ({
  type: VIDEO.DELETE_COMMENT,
  commentId
});

export const deleteVideoDiscussion = (
  discussionId,
  callback
) => async dispatch => {
  try {
    await request.delete(
      `${API_URL}/discussions?discussionId=${discussionId}`,
      auth()
    );
    dispatch({
      type: VIDEO.DELETE_DISCUSSION,
      discussionId
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editVideoComment = data => ({
  type: VIDEO.EDIT_COMMENT,
  ...data
});

export const editRewardComment = ({ id, text }) => ({
  type: VIDEO.EDIT_REWARD_COMMENT,
  id,
  text
});

export const editVideoDiscussion = (
  discussionId,
  editedTitle,
  editedDescription,
  callback
) => async dispatch => {
  try {
    const { data } = await request.put(
      `${API_URL}/discussions`,
      { discussionId, editedTitle, editedDescription },
      auth()
    );
    dispatch({
      type: VIDEO.EDIT_DISCUSSION,
      data,
      discussionId
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editVideoPage = params => async dispatch => {
  try {
    const { data } = await request.post(`${API_URL}/edit/page`, params, auth());
    if (data.success) {
      dispatch({
        type: VIDEO.EDIT_PAGE,
        params
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editVideoTitle = params => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/edit/title`,
      params,
      auth()
    );
    if (data.result) {
      dispatch({
        type: VIDEO.EDIT_TITLE,
        videoId: params.videoId,
        data: data.result
      });
    }
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const emptyCurrentVideoSlot = () => ({
  type: VIDEO.EMPTY_CURRENT_VIDEO_SLOT
});

export const fillCurrentVideoSlot = videoId => ({
  type: VIDEO.FILL_CURRENT_VIDEO_SLOT,
  videoId
});

export const getMoreVideos = videoId => async dispatch => {
  try {
    const { data } = await request.get(`${API_URL}?videoId=${videoId}`);
    dispatch({
      type: VIDEO.LOAD,
      initialRun: false,
      videos: data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const likeVideo = (likes, videoId) => async dispatch => {
  dispatch({
    type: VIDEO.LIKE,
    data: likes,
    videoId
  });
  dispatch(likePlaylistVideo(likes, videoId));
};

export const likeVideoComment = ({ commentId, likes }) => ({
  type: VIDEO.LIKE_COMMENT,
  data: { commentId, likes }
});

export const loadMoreComments = data => ({
  type: VIDEO.LOAD_MORE_COMMENTS,
  ...data
});

export const loadMoreDiscussionReplies = ({
  commentId,
  loadMoreButton,
  replies
}) => ({
  type: VIDEO.LOAD_MORE_DISCUSSION_REPLIES,
  commentId,
  loadMoreButton,
  replies
});

export const loadMoreReplies = ({ commentId, loadMoreButton, replies }) => ({
  type: VIDEO.LOAD_MORE_REPLIES,
  commentId,
  loadMoreButton,
  replies
});

export const loadMoreDiscussionComments = ({ data, discussionId }) => ({
  type: VIDEO.LOAD_MORE_DISCUSSION_COMMENTS,
  discussionId,
  ...data
});

export const loadMoreDiscussions = (
  videoId,
  lastDiscussionId
) => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/discussions?videoId=${videoId}&lastDiscussionId=${lastDiscussionId}`
    );
    dispatch({
      type: VIDEO.LOAD_MORE_DISCUSSIONS,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadMorePlaylistVideos = (
  videoId,
  playlistId,
  shownVideos
) => async dispatch => {
  try {
    const {
      data: { playlistVideos, playlistVideosLoadMoreShown }
    } = await request.get(
      `${API_URL}/more/playlistVideos?videoId=${videoId}&playlistId=${playlistId}&${shownVideos}`
    );
    dispatch({
      type: VIDEO.LOAD_MORE_RIGHT_MENU_PL_VIDS,
      playlistVideos,
      playlistVideosLoadMoreShown
    });
    Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadRightMenuVideos = (videoId, playlistId) => async dispatch => {
  try {
    const { data } = await request.get(
      `${URL}/${
        playlistId ? 'playlist' : 'video'
      }/rightMenu?videoId=${videoId}${
        playlistId ? `&playlistId=${playlistId}` : ''
      }`
    );
    dispatch({
      type: VIDEO.LOAD_RIGHT_MENU_VIDS,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadVideoComments = data => ({
  type: VIDEO.LOAD_COMMENTS,
  ...data
});

export const loadVideoDiscussions = videoId => async dispatch => {
  try {
    const { data } = await request.get(
      `${API_URL}/discussions?videoId=${videoId}`
    );
    dispatch({
      type: VIDEO.LOAD_DISCUSSIONS,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const loadVideoDiscussionComments = ({ data, discussionId }) => ({
  type: VIDEO.LOAD_DISCUSSION_COMMENTS,
  discussionId,
  ...data
});

export const loadVideoPage = (videoId, fromClientSide) => async dispatch => {
  if (isNaN(videoId)) return dispatch({ type: VIDEO.PAGE_UNAVAILABLE });
  try {
    const { data } = await request.get(`${API_URL}/page?videoId=${videoId}`);
    dispatch({
      type: VIDEO.LOAD_PAGE,
      data
    });
    dispatch(loadVideoDiscussions(videoId));
    return Promise.resolve();
  } catch (error) {
    dispatch({ type: VIDEO.PAGE_UNAVAILABLE });
    handleError(error, dispatch);
  }
};

export const openAddVideoModal = () => ({
  type: VIDEO.OPEN_MODAL
});

export const resetVideoPage = () => ({
  type: VIDEO.RESET_PAGE
});

export const resetVideoState = () => ({
  type: VIDEO.RESET
});

export const starVideo = videoId => async dispatch => {
  try {
    const { data } = await request.put(`${API_URL}/star`, { videoId }, auth());
    return dispatch({
      type: VIDEO.STAR,
      videoId,
      isStarred: data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const uploadQuestions = params => async dispatch => {
  try {
    await request.post(`${API_URL}/questions`, params, auth());
    const questions = params.questions.map(question => {
      return {
        title: question.title,
        choices: [
          question.choice1,
          question.choice2,
          question.choice3,
          question.choice4,
          question.choice5
        ],
        correctChoice: question.correctChoice
      };
    });
    dispatch({
      type: VIDEO.ADD_QUESTIONS,
      data: questions
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const uploadVideo = params => async dispatch => {
  try {
    const { data } = await request.post(API_URL, params, auth());
    dispatch({
      type: VIDEO.UPLOAD,
      data: [data.result]
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const uploadComment = comment => ({
  type: VIDEO.UPLOAD_COMMENT,
  comment
});

export const uploadReply = reply => ({
  type: VIDEO.UPLOAD_REPLY,
  reply
});

export const uploadVideoDiscussion = (
  title,
  description,
  videoId
) => async dispatch => {
  try {
    const { data } = await request.post(
      `${API_URL}/discussions`,
      { title, description, videoId },
      auth()
    );
    dispatch({
      type: VIDEO.UPLOAD_DISCUSSION,
      data
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};
