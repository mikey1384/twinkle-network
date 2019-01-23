import request from 'axios';
import { likePlaylistVideo } from './PlaylistActions';
import { auth, handleError } from 'helpers/requestHelpers';
import { URL } from 'constants/URL';
import VIDEO from '../constants/Video';

const API_URL = `${URL}/video`;

export const addTags = ({ tags }) => ({
  type: VIDEO.ADD_TAGS,
  tags
});

export const addVideoView = params => dispatch => {
  try {
    request.post(`${API_URL}/view`, params);
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const changeByUserStatusForThumbs = ({ videoId, byUser }) => ({
  type: VIDEO.CHANGE_BY_USER_STATUS,
  videoId,
  byUser
});

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
    dispatch({
      type: VIDEO.DELETE,
      arrayIndex,
      data
    });
    return Promise.resolve();
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const editVideoThumbs = params => ({
  type: VIDEO.EDIT_THUMBS,
  params
});

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

export const getInitialVideos = () => async dispatch => {
  try {
    const {
      data: { videos, loadMoreButton }
    } = await request.get(API_URL);
    dispatch({
      type: VIDEO.LOAD,
      initialRun: true,
      loadMoreButton,
      videos
    });
  } catch (error) {
    handleError(error, dispatch);
  }
};

export const getMoreVideos = ({ videos, loadMoreButton }) => ({
  type: VIDEO.LOAD,
  initialRun: false,
  loadMoreButton,
  videos
});

export const loadTags = ({ tags }) => ({
  type: VIDEO.LOAD_TAGS,
  tags
});

export const likeVideo = ({ likes, videoId }) => async dispatch => {
  dispatch({
    type: VIDEO.LIKE,
    data: likes,
    videoId
  });
  dispatch(likePlaylistVideo(likes, videoId));
};

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

export const openAddVideoModal = () => ({
  type: VIDEO.OPEN_MODAL
});

export const resetVideoState = () => ({
  type: VIDEO.RESET
});

export const setDifficulty = ({ contentId, difficulty }) => ({
  type: VIDEO.SET_DIFFICULTY,
  videoId: Number(contentId),
  difficulty
});

export const setDiscussionDifficulty = ({ contentId, difficulty }) => ({
  type: VIDEO.SET_DISCUSSION_DIFFICULTY,
  contentId,
  difficulty
});

export const uploadVideo = data => ({
  type: VIDEO.UPLOAD,
  data
});

export const uploadComment = comment => ({
  type: VIDEO.UPLOAD_COMMENT,
  comment
});

export const uploadReply = reply => ({
  type: VIDEO.UPLOAD_REPLY,
  reply
});
