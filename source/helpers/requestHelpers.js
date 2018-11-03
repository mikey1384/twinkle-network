import request from 'axios';
import { logout, openSigninModal } from 'redux/actions/UserActions';
import { URL } from 'constants/URL';
import { queryStringForArray } from 'helpers/stringHelpers';

export const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export const auth = () => ({
  headers: {
    authorization: token()
  }
});
export function handleError(error, dispatch) {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      dispatch(logout());
      dispatch(openSigninModal());
    }
    if (status === 301) {
      window.location.reload();
    }
  }
  console.error(error.response || error);
  return Promise.reject(error);
}

export const addVideoToPlaylists = async({
  dispatch,
  videoId,
  playlistIds
}) => {
  try {
    await request.post(
      `${URL}/playlist/videoToPlaylists`,
      { videoId, playlistIds },
      auth()
    );
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const checkIfContentExists = async({ url, videoCode, type }) => {
  try {
    const {
      data: { exists, content }
    } = await request.get(
      `${URL}/content/checkUrl?url=${encodeURIComponent(url)}&type=${type}${
        videoCode ? `&videoCode=${videoCode}` : ''
      }`
    );
    return Promise.resolve({ exists, content });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const deleteContent = async({ id, type, dispatch }) => {
  try {
    await request.delete(`${URL}/content?contentId=${id}&type=${type}`, auth());
    return Promise.resolve({ contentId: id, type });
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const deleteDiscussion = async({ discussionId, dispatch }) => {
  try {
    await request.delete(
      `${URL}/content/discussions?discussionId=${discussionId}`,
      auth()
    );
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const editContent = async({
  params: {
    contentId,
    editedComment,
    editedContent,
    editedDescription,
    editedTitle,
    editedUrl,
    type
  },
  dispatch
}) => {
  try {
    const { data } = await request.put(
      `${URL}/content`,
      {
        contentId,
        editedComment,
        editedContent,
        editedDescription,
        editedTitle,
        editedUrl,
        type
      },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const editDiscussion = async({
  discussionId,
  editedTitle,
  editedDescription,
  dispatch
}) => {
  try {
    const { data } = await request.put(
      `${URL}/content/discussions`,
      { discussionId, editedTitle, editedDescription },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const editPlaylistVideos = async({
  addedVideoIds,
  dispatch,
  removedVideoIds,
  playlistId
}) => {
  try {
    const { data: playlist } = await request.put(
      `${URL}/playlist/videos`,
      { addedVideoIds, removedVideoIds, playlistId },
      auth()
    );
    return Promise.resolve(playlist);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const fetchPlaylistsContaining = async({ videoId }) => {
  try {
    const { data: playlists } = await request.get(
      `${URL}/playlist/containing?videoId=${videoId}`
    );
    return Promise.resolve(playlists);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const likeContent = async({ id, type, dispatch }) => {
  try {
    const {
      data: { likes }
    } = await request.post(`${URL}/content/like`, { id, type }, auth());
    return Promise.resolve(likes);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const loadChat = async({ channelId, dispatch, testAuth } = {}) => {
  try {
    const { data } = await request.get(
      `${URL}/chat?channelId=${channelId}`,
      testAuth || auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return dispatch ? handleError(error, dispatch) : Promise.reject(error);
  }
};

export const loadComments = async({ id, type, lastCommentId, limit }) => {
  try {
    const {
      data: { comments, loadMoreButton }
    } = await request.get(
      `${URL}/content/comments?contentId=${id}&type=${type}&lastCommentId=${lastCommentId}&limit=${limit}`
    );
    return Promise.resolve({ comments, loadMoreButton });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadNotableContent = async({ userId }) => {
  try {
    const {
      data: { results, loadMoreButton }
    } = await request.get(`${URL}/content/noteworthy?userId=${userId}&limit=1`);
    return Promise.resolve({ results, loadMoreButton });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadMoreNotableContents = async({ userId, notables }) => {
  try {
    const {
      data: { results, loadMoreButton }
    } = await request.get(
      `${URL}/content/noteworthy?userId=${userId}&limit=2&${queryStringForArray(
        {
          array: notables,
          originVar: 'feedId',
          destinationVar: 'shownFeeds'
        }
      )}`
    );
    return Promise.resolve({ results, loadMoreButton });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadDiscussions = async({
  type,
  contentId,
  lastDiscussionId
}) => {
  try {
    const { data } = await request.get(
      `${URL}/content/discussions?contentId=${contentId}&type=${type}&lastDiscussionId=${lastDiscussionId}`
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadMonthlyXp = async userId => {
  try {
    const { data } = await request.get(
      `${URL}/user/monthlyXp?userId=${userId}`
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadNewFeeds = async({ lastInteraction, shownFeeds }) => {
  try {
    const { data } = await request.get(
      `${URL}/content/newFeeds?lastInteraction=${lastInteraction}${
        shownFeeds ? `&${shownFeeds}` : ''
      }`
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadPlaylists = async({ shownPlaylists }) => {
  try {
    const {
      data: { results, loadMoreButton }
    } = await request.get(
      `${URL}/playlist/?${queryStringForArray({
        array: shownPlaylists,
        originVar: 'id',
        destinationVar: 'shownPlaylists'
      })}`
    );
    return Promise.resolve({ results, loadMoreButton });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadPlaylistVideos = async({
  limit,
  shownVideos,
  targetVideos,
  playlistId
}) => {
  try {
    const {
      data: { title, videos, loadMoreButton }
    } = await request.get(
      `${URL}/playlist/playlist?playlistId=${playlistId}${
        shownVideos
          ? '&' +
            queryStringForArray({
              array: shownVideos,
              originVar: 'id',
              destinationVar: 'shownVideos'
            })
          : ''
      }${
        targetVideos
          ? '&' +
            queryStringForArray({
              array: targetVideos,
              originVar: 'id',
              destinationVar: 'targetVideos'
            })
          : ''
      }&limit=${limit}`
    );
    return Promise.resolve({ title, results: videos, loadMoreButton });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadVideos = async({ limit, videoId, excludeVideoIds = [] }) => {
  try {
    const {
      data: { videos: results, loadMoreButton }
    } = await request.get(
      `${URL}/video?numberToLoad=${limit}&videoId=${videoId}${
        excludeVideoIds.length > 0
          ? `&${queryStringForArray({
              array: excludeVideoIds,
              destinationVar: 'excludes'
            })}`
          : ''
      }`
    );
    return Promise.resolve({ results, loadMoreButton });
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const reorderPlaylistVideos = async({
  dispatch,
  originalVideoIds,
  reorderedVideoIds,
  playlistId
}) => {
  try {
    const { data: playlist } = await request.put(
      `${URL}/playlist/videos`,
      { originalVideoIds, reorderedVideoIds, playlistId },
      auth()
    );
    return Promise.resolve(playlist);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const searchContent = async({
  filter,
  limit,
  searchText,
  shownResults
}) => {
  try {
    const { data } = await request.get(
      `${URL}/content/search?filter=${filter}&limit=${limit}&searchText=${searchText}${
        shownResults
          ? `&${queryStringForArray({
              array: shownResults,
              originVar: 'id',
              destinationVar: 'shownResults'
            })}`
          : ''
      }`
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const setDefaultSearchFilter = async({ filter, dispatch }) => {
  try {
    const { data } = await request.post(
      `${URL}/user/searchFilter`,
      { filter },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const setDifficulty = async({
  difficulty,
  contentId,
  dispatch,
  type
}) => {
  try {
    await request.put(
      `${URL}/content/difficulty`,
      { difficulty, contentId, type },
      auth()
    );
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const setTheme = async({ color, dispatch }) => {
  try {
    await request.put(`${URL}/user/theme`, { color }, auth());
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadProfileInfo = async({
  dispatch,
  email,
  website,
  youtubeName,
  youtubeUrl
}) => {
  try {
    const { data } = await request.put(
      `${URL}/user/info`,
      {
        email,
        website,
        youtubeName,
        youtubeUrl
      },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    console.log(error);
    return handleError(error, dispatch);
  }
};

export const uploadGreeting = async({ greeting, dispatch }) => {
  try {
    await request.put(`${URL}/user/greeting`, { greeting }, auth());
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadComment = async({
  content,
  parent,
  rootCommentId,
  targetCommentId,
  dispatch
}) => {
  try {
    const { data } = await request.post(
      `${URL}/content/comments`,
      { content, parent, rootCommentId, targetCommentId },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadContent = async({
  url,
  isVideo,
  title,
  description,
  dispatch
}) => {
  try {
    const { data } = await request.post(
      `${URL}/content`,
      { url, isVideo, title, description },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadDiscussion = async({
  type,
  contentId,
  title,
  description,
  dispatch
}) => {
  try {
    const { data } = await request.post(
      `${URL}/content/discussions`,
      { title, description, contentId, type },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadPlaylist = async({
  dispatch,
  title,
  description,
  selectedVideos
}) => {
  try {
    const {
      data: { result }
    } = await request.post(
      `${URL}/playlist`,
      { title, description, selectedVideos },
      auth()
    );
    return Promise.resolve(result);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const verifyEmail = async({ dispatch }) => {
  try {
    const { data } = await request.put(
      `${URL}/user/email/verify`,
      undefined,
      auth()
    );
    console.log(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};
