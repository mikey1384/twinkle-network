import request from 'axios';
import { logout, openSigninModal } from 'redux/actions/UserActions';
import { clientVersion } from 'constants/defaultValues';
import { queryStringForArray } from 'helpers/stringHelpers';
import StackTrace from 'stacktrace-js';
import URL from 'constants/URL';

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

export const checkIfUserResponded = async subjectId => {
  try {
    const { data } = await request.get(
      `${URL}/content/checkResponded?subjectId=${subjectId}`,
      auth()
    );
    return Promise.resolve(data);
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

export const deleteSubject = async({ subjectId, dispatch }) => {
  try {
    await request.delete(
      `${URL}/content/subjects?subjectId=${subjectId}`,
      auth()
    );
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const editContent = async({ params, dispatch }) => {
  try {
    const { data } = await request.put(`${URL}/content`, params, auth());
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const editSubject = async({
  subjectId,
  editedTitle,
  editedDescription,
  dispatch
}) => {
  try {
    const { data } = await request.put(
      `${URL}/content/subjects`,
      { subjectId, editedTitle, editedDescription },
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

export const fetchCurrentChessState = async channelId => {
  try {
    const { data } = await request.get(
      `${URL}/chat/chess?channelId=${channelId}`
    );
    return Promise.resolve(data);
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

export const loadContent = async({ contentId, type }) => {
  try {
    const { data } = await request.get(
      `${URL}/content?contentId=${contentId}&type=${type}`
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
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

export const loadFeaturedChallenges = async() => {
  try {
    const { data } = await request.get(`${URL}/content/featured/challenges`);
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadFeaturedPlaylists = async() => {
  try {
    const { data } = await request.get(`${URL}/content/featured/playlists`);
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadFeeds = async({
  filter = 'all',
  order = 'desc',
  orderBy = 'lastInteraction',
  username,
  shownFeeds
} = {}) => {
  try {
    const { data } = await request.get(
      `${URL}/content/feeds?filter=${filter}&username=${username}&order=${order}&orderBy=${orderBy}&${
        shownFeeds ? `&${shownFeeds}` : ''
      }`,
      auth()
    );
    return Promise.resolve({ data, filter });
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

export const loadReplies = async({ lastReplyId, commentId }) => {
  try {
    const { data } = await request.get(
      `${URL}/content/replies?${
        lastReplyId ? `lastReplyId=${lastReplyId}&` : ''
      }commentId=${commentId}&includeAll=true`
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};

export const loadSubjects = async({ type, contentId, lastSubjectId }) => {
  try {
    const { data } = await request.get(
      `${URL}/content/subjects?contentId=${contentId}&type=${type}&lastSubjectId=${lastSubjectId}`
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

export const loadUploads = async({
  limit,
  contentId,
  includeRoot,
  excludeContentIds = [],
  type
}) => {
  try {
    const {
      data: { results, loadMoreButton }
    } = await request.get(
      `${URL}/content/uploads?numberToLoad=${limit}&type=${type}&contentId=${contentId}${
        excludeContentIds.length > 0
          ? `&${queryStringForArray({
              array: excludeContentIds,
              destinationVar: 'excludes'
            })}`
          : ''
      }${includeRoot ? '&includeRoot=true' : ''}`
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

export const reportBug = async({ error, info }) => {
  const errorStack = await StackTrace.fromError(error);
  await StackTrace.report(errorStack, `${URL}/user/error`, {
    clientVersion,
    message: error.message,
    info: info?.componentStack,
    token: auth()?.headers?.authorization
  });
  return Promise.resolve();
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

export const setByUser = async({ contentId, dispatch }) => {
  try {
    const {
      data: { byUser }
    } = await request.put(`${URL}/content/byUser`, { contentId }, auth());
    return Promise.resolve(byUser);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const setChessMoveViewTimeStamp = async({
  channelId,
  messageId,
  dispatch
}) => {
  try {
    await request.put(
      `${URL}/chat/chess/timeStamp`,
      { channelId, messageId },
      auth()
    );
    return Promise.resolve();
  } catch (error) {
    return handleError(error, dispatch);
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

export const startNewDMChannel = async({ dispatch, ...params }) => {
  try {
    const { data } = await request.post(
      `${URL}/chat/channel/twoPeople`,
      params,
      auth()
    );
    return Promise.resolve(data);
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
    console.error(error);
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
  attachment,
  url,
  isVideo,
  title,
  description,
  secretAnswer,
  dispatch
}) => {
  try {
    const { data } = await request.post(
      `${URL}/content`,
      { attachment, url, isVideo, title, description, secretAnswer },
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadFeaturedChallenges = async({ dispatch, selected }) => {
  try {
    const challenges = await request.post(
      `${URL}/content/featured/challenges`,
      { selectedChallenges: selected },
      auth()
    );
    return Promise.resolve(challenges);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadFeaturedPlaylists = async({
  dispatch,
  selectedPlaylists
}) => {
  try {
    const {
      data: { playlists }
    } = await request.post(
      `${URL}/playlist/pinned`,
      { selectedPlaylists },
      auth()
    );
    return Promise.resolve(playlists);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const uploadSubject = async({
  type,
  contentId,
  title,
  description,
  dispatch
}) => {
  try {
    const { data } = await request.post(
      `${URL}/content/subjects`,
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

export const sendVerificationEmail = async({ dispatch }) => {
  try {
    const { data } = await request.put(
      `${URL}/user/email/verify`,
      undefined,
      auth()
    );
    return Promise.resolve(data);
  } catch (error) {
    return handleError(error, dispatch);
  }
};

export const verifyEmail = async({ token }) => {
  try {
    const {
      data: { username }
    } = await request.get(`${URL}/user/email/verify?token=${token}`, auth());
    return Promise.resolve(username);
  } catch (error) {
    console.error(error.response || error);
    return Promise.reject(error);
  }
};
