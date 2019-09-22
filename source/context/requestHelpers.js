import request from 'axios';
import { queryStringForArray, stringIsEmpty } from 'helpers/stringHelpers';
import { clientVersion } from 'constants/defaultValues';
import URL from 'constants/URL';

const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

const auth = () => ({
  headers: {
    authorization: token()
  }
});

export default function requestHelpers(handleError) {
  return {
    auth,
    async addVideoToPlaylists({ videoId, playlistIds }) {
      try {
        await request.post(
          `${URL}/playlist/videoToPlaylists`,
          { videoId, playlistIds },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async addVideoView(params) {
      try {
        request.post(`${URL}/video/view`, params);
      } catch (error) {
        handleError(error);
      }
    },
    async checkIfContentExists({ url, videoCode, contentType }) {
      try {
        const {
          data: { exists, content }
        } = await request.get(
          `${URL}/content/checkUrl?url=${encodeURIComponent(
            url
          )}&contentType=${contentType}${
            videoCode ? `&videoCode=${videoCode}` : ''
          }`
        );
        return Promise.resolve({ exists, content });
      } catch (error) {
        return handleError(error);
      }
    },
    async checkIfUserExists(username) {
      try {
        const {
          data: { pageNotExists, user }
        } = await request.get(
          `${URL}/user/username/check?username=${username}`
        );
        return Promise.resolve({ pageNotExists, user });
      } catch (error) {
        return handleError(error);
      }
    },
    async checkIfUserResponded(subjectId) {
      try {
        const { data } = await request.get(
          `${URL}/content/checkResponded?subjectId=${subjectId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async checkVersion() {
      try {
        const { data } = await request.get(
          `${URL}/notification/version?version=${clientVersion}`
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async checkXPEarned(videoId) {
      try {
        const {
          data: { xpEarned }
        } = await request.get(
          `${URL}/video/xpEarned?videoId=${videoId}`,
          auth()
        );
        return Promise.resolve(xpEarned);
      } catch (error) {
        return handleError(error);
      }
    },
    async createNewChat({ channelName, selectedUsers }) {
      try {
        const { data } = await request.post(
          `${URL}/chat/channel`,
          { channelName, selectedUsers },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async deleteContent({ id, contentType }) {
      try {
        await request.delete(
          `${URL}/content?contentId=${id}&contentType=${contentType}`,
          auth()
        );
        return Promise.resolve({ contentId: id, contentType });
      } catch (error) {
        return handleError(error);
      }
    },
    async deleteMessage({ fileName = '', filePath = '', messageId }) {
      try {
        await request.delete(
          `${URL}/chat/message?messageId=${messageId}&filePath=${filePath}&fileName=${fileName}`,
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async deletePlaylist(playlistId) {
      try {
        await request.delete(
          `${URL}/playlist?playlistId=${playlistId}`,
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async deleteSubject({ subjectId }) {
      try {
        await request.delete(
          `${URL}/content/subjects?subjectId=${subjectId}`,
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async deleteVideo({ videoId, lastVideoId }) {
      try {
        const { data } = await request.delete(
          `${URL}/video?videoId=${videoId}&lastVideoId=${lastVideoId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async editChannelTitle(params) {
      try {
        await request.post(`${URL}/chat/title`, params, auth());
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async editContent({
      contentId,
      editedComment,
      editedDescription,
      editedSecretAnswer,
      editedTitle,
      editedUrl,
      contentType
    }) {
      try {
        const { data } = await request.put(
          `${URL}/content`,
          {
            contentId,
            editedComment,
            editedDescription,
            editedSecretAnswer,
            editedTitle,
            editedUrl,
            contentType
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async editMessage({ editedMessage, messageId }) {
      try {
        await request.put(
          `${URL}/chat/message`,
          { editedMessage, messageId },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async editPlaylistTitle(params) {
      try {
        const {
          data: { title }
        } = await request.put(`${URL}/playlist/title`, params, auth());
        return Promise.resolve(title);
      } catch (error) {
        handleError(error);
      }
    },
    async editRewardComment({ editedComment, contentId }) {
      try {
        await request.put(
          `${URL}/user/reward`,
          { editedComment, contentId },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async editSubject({
      subjectId,
      editedTitle,
      editedDescription,
      editedSecretAnswer
    }) {
      try {
        const { data } = await request.put(
          `${URL}/content/subjects`,
          { subjectId, editedTitle, editedDescription, editedSecretAnswer },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async editPlaylistVideos({ addedVideoIds, removedVideoIds, playlistId }) {
      try {
        const { data: playlist } = await request.put(
          `${URL}/playlist/videos`,
          { addedVideoIds, removedVideoIds, playlistId },
          auth()
        );
        return Promise.resolve(playlist);
      } catch (error) {
        return handleError(error);
      }
    },
    async fetchPlaylistsContaining({ videoId }) {
      try {
        const { data: playlists } = await request.get(
          `${URL}/playlist/containing?videoId=${videoId}`
        );
        return Promise.resolve(playlists);
      } catch (error) {
        return handleError(error);
      }
    },
    async fetchCurrentChessState({ channelId, recentChessMessage }) {
      try {
        const { data } = await request.put(
          `${URL}/chat/chess`,
          {
            channelId,
            recentChessMessage
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async fetchNotifications() {
      try {
        if (auth().headers.authorization === null) {
          const { data } = await request.get(`${URL}/notification/chatSubject`);
          return Promise.resolve({
            notifications: [],
            rewards: [],
            totalRewardAmount: 0,
            currentChatSubject: data
          });
        } else {
          const { data } = await request.get(`${URL}/notification`, auth());
          return Promise.resolve(data);
        }
      } catch (error) {
        handleError(error);
      }
    },
    async fetchVideoThumbUrl({ videoCode, videoId }) {
      try {
        const {
          data: { payload }
        } = await request.put(`${URL}/video/videoThumb`, {
          videoCode,
          videoId
        });
        return Promise.resolve(
          payload || `https://img.youtube.com/vi/${videoCode}/mqdefault.jpg`
        );
      } catch (error) {
        console.error(error.response || error);
      }
    },
    async getNumberOfUnreadMessages() {
      if (auth() === null) return;
      try {
        const {
          data: { numUnreads }
        } = await request.get(`${URL}/chat/numUnreads`, auth());
        return Promise.resolve(numUnreads);
      } catch (error) {
        handleError(error);
      }
    },
    async hideChat(channelId) {
      try {
        await request.post(`${URL}/chat/hideChat`, { channelId }, auth());
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async initSession(pathname) {
      if (token() === null) {
        request.post(`${URL}/user/recordAnonTraffic`, { pathname });
        return {};
      }
      try {
        const { data } = await request.get(
          `${URL}/user/session?pathname=${pathname}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async inviteUsersToChannel(params) {
      try {
        const {
          data: { message }
        } = await request.post(`${URL}/chat/invite`, params, auth());
        return Promise.resolve({ ...params, message });
      } catch (error) {
        handleError(error);
      }
    },
    async leaveChannel(channelId) {
      const timeStamp = Math.floor(Date.now() / 1000);
      try {
        await request.delete(
          `${URL}/chat/channel?channelId=${channelId}&timeStamp=${timeStamp}`,
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        handleError(error);
      }
    },
    async likeContent({ id, contentType }) {
      try {
        const {
          data: { likes }
        } = await request.post(
          `${URL}/content/like`,
          { id, contentType },
          auth()
        );
        return Promise.resolve(likes);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadChat({ channelId, testAuth } = {}) {
      try {
        const { data } = await request.get(
          `${URL}/chat?channelId=${channelId}`,
          testAuth || auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadChatChannel({ channelId }) {
      try {
        const { data } = await request.get(
          `${URL}/chat/channel?channelId=${channelId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMoreChannels({ currentChannelId, channelIds }) {
      try {
        const { data } = await request.get(
          `${URL}/chat/more/channels?currentChannelId=${currentChannelId}&${channelIds}`,
          auth()
        );
        Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadMoreChatMessages({ userId, messageId, channelId }) {
      try {
        const { data } = await request.get(
          `${URL}/chat/more/messages?userId=${userId}&messageId=${messageId}&channelId=${channelId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadMoreNotifications(lastId) {
      try {
        const { data } = await request.get(
          `${URL}/notification?lastId=${lastId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadPlaylistList() {
      try {
        const { data } = await request.get(`${URL}/playlist/list`);
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadMorePlaylistList(playlistId) {
      try {
        const { data } = await request.get(
          `${URL}/playlist/list?playlistId=${playlistId}`
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadMoreRewards(lastId) {
      try {
        const { data } = await request.get(
          `${URL}/notification/more/rewards?lastId=${lastId}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadChatSubject() {
      try {
        const { data } = await request.get(`${URL}/chat/chatSubject`);
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async loadDMChannel({ recepient }) {
      try {
        const { data } = await request.get(
          `${URL}/chat/channel/check?partnerId=${recepient.id}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadContent({ contentId, contentType }) {
      try {
        const { data } = await request.get(
          `${URL}/content?contentId=${contentId}&contentType=${contentType}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadComments({ contentId, contentType, lastCommentId, limit }) {
      try {
        const {
          data: { comments, loadMoreButton }
        } = await request.get(
          `${URL}/content/comments?contentId=${contentId}&contentType=${contentType}&lastCommentId=${lastCommentId}&limit=${limit}`
        );
        return Promise.resolve({ comments, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadFeaturedSubjects() {
      try {
        const { data } = await request.get(`${URL}/content/featured/subjects`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadFeaturedPlaylists() {
      try {
        const { data } = await request.get(`${URL}/content/featured/playlists`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadFeeds({
      filter = 'all',
      order = 'desc',
      orderBy = 'lastInteraction',
      username,
      shownFeeds
    } = {}) {
      try {
        const { data } = await request.get(
          `${URL}/content/feeds?filter=${filter}&username=${username}&order=${order}&orderBy=${orderBy}&${
            shownFeeds ? `&${shownFeeds}` : ''
          }`,
          auth()
        );
        return Promise.resolve({ data, filter });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadNotableContent({ userId }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/noteworthy?userId=${userId}&limit=1`
        );
        return Promise.resolve({ results, loadMoreButton });
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMoreNotableContents({ userId, notables }) {
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
        return handleError(error);
      }
    },
    async loadReplies({ lastReplyId, commentId }) {
      try {
        const { data } = await request.get(
          `${URL}/content/replies?${
            lastReplyId ? `lastReplyId=${lastReplyId}&` : ''
          }commentId=${commentId}&includeAll=true`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadSubjects({ contentType, contentId, lastSubjectId }) {
      try {
        const { data } = await request.get(
          `${URL}/content/subjects?contentId=${contentId}&contentType=${contentType}&lastSubjectId=${lastSubjectId}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadMonthlyXp(userId) {
      try {
        const { data } = await request.get(
          `${URL}/user/monthlyXp?userId=${userId}`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadNewFeeds({ lastInteraction, shownFeeds }) {
      try {
        const { data } = await request.get(
          `${URL}/content/newFeeds?lastInteraction=${lastInteraction}${
            shownFeeds ? `&${shownFeeds}` : ''
          }`
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadPlaylists({ shownPlaylists }) {
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
        return handleError(error);
      }
    },
    async loadPlaylistVideos({ limit, shownVideos, targetVideos, playlistId }) {
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
        return handleError(error);
      }
    },
    async loadUploads({
      limit,
      contentId,
      includeRoot,
      excludeContentIds = [],
      contentType
    }) {
      try {
        const {
          data: { results, loadMoreButton }
        } = await request.get(
          `${URL}/content/uploads?numberToLoad=${limit}&contentType=${contentType}&contentId=${contentId}${
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
        return handleError(error);
      }
    },
    async loadUsers({ orderBy, shownUsersIds } = {}) {
      try {
        const { data } = await request.get(
          `${URL}/user/users${orderBy ? `?orderBy=${orderBy}` : ''}${
            shownUsersIds ? `${orderBy ? '&' : '?'}${shownUsersIds}` : ''
          }`
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async reloadChatSubject(subjectId) {
      try {
        const {
          data: { subject, message }
        } = await request.put(
          `${URL}/chat/chatSubject/reload`,
          { subjectId },
          auth()
        );
        return Promise.resolve({ subject, message });
      } catch (error) {
        handleError(error);
      }
    },
    async reorderPlaylistVideos({
      originalVideoIds,
      reorderedVideoIds,
      playlistId
    }) {
      try {
        const { data: playlist } = await request.put(
          `${URL}/playlist/videos`,
          { originalVideoIds, reorderedVideoIds, playlistId },
          auth()
        );
        return Promise.resolve(playlist);
      } catch (error) {
        return handleError(error);
      }
    },
    async searchChat(text) {
      try {
        const { data } = await request.get(
          `${URL}/chat/search/chat?text=${text}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async searchChatSubject(text) {
      try {
        const { data } = await request.get(
          `${URL}/chat/search/subject?text=${text}`
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async login(params) {
      try {
        const { data } = await request.post(`${URL}/user/login`, params);
        localStorage.setItem('token', data.token);
        return Promise.resolve(data);
      } catch (error) {
        if (error.response.status === 401) {
          return Promise.reject('Incorrect username/password combination');
        }
        return handleError(error);
      }
    },
    async saveMessage(message) {
      try {
        const {
          data: { messageId }
        } = await request.post(`${URL}/chat`, { message }, auth());
        return Promise.resolve(messageId);
      } catch (error) {
        handleError(error);
      }
    },
    async searchContent({ filter, limit, searchText, shownResults }) {
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
        return handleError(error);
      }
    },
    async searchUsers(query) {
      try {
        const { data: users } = await request.get(
          `${URL}/user/users/search?queryString=${query}`
        );
        return Promise.resolve(users);
      } catch (error) {
        return handleError(error);
      }
    },
    async searchUserToInvite(text) {
      try {
        const { data } = await request.get(
          `${URL}/chat/search/users?text=${text}`
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async setByUser({ contentId }) {
      try {
        const {
          data: { byUser }
        } = await request.put(`${URL}/content/byUser`, { contentId }, auth());
        return Promise.resolve(byUser);
      } catch (error) {
        return handleError(error);
      }
    },
    async setChessMoveViewTimeStamp({ channelId, message }) {
      try {
        await request.put(
          `${URL}/chat/chess/timeStamp`,
          { channelId, message },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async setDefaultSearchFilter({ filter }) {
      try {
        const { data } = await request.post(
          `${URL}/user/searchFilter`,
          { filter },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async setTheme({ color }) {
      try {
        await request.put(`${URL}/user/theme`, { color }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async signup(params) {
      try {
        const { data } = await request.post(`${URL}/user/signup`, params);
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async toggleHideWatched() {
      try {
        const {
          data: { hideWatched }
        } = await request.put(`${URL}/user/hideWatched`, {}, auth());
        return Promise.resolve(hideWatched);
      } catch (error) {
        return handleError(error);
      }
    },
    async updateChatLastRead({ channelId }) {
      try {
        await request.post(`${URL}/chat/lastRead`, { channelId }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async updateRewardLevel({ rewardLevel, contentId, contentType }) {
      try {
        await request.put(
          `${URL}/content/rewardLevel`,
          { rewardLevel, contentId, contentType },
          auth()
        );
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async updateUserXP({ amount, action, target, targetId, type, dispatch }) {
      try {
        const {
          data: { xp, alreadyDone, rank }
        } = await request.post(
          `${URL}/user/xp`,
          { amount, action, target, targetId, type },
          auth()
        );
        return Promise.resolve({ xp, alreadyDone, rank });
      } catch (error) {
        return handleError(error, dispatch);
      }
    },
    async uploadChatSubject(content) {
      try {
        const { data } = await request.post(
          `${URL}/chat/chatSubject`,
          { content },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        handleError(error);
      }
    },
    async startNewDMChannel(params) {
      try {
        const { data } = await request.post(
          `${URL}/chat/channel/twoPeople`,
          params,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async updateCurrentlyWatching({ watchCode }) {
      const authorization = auth();
      const authExists = !!authorization.headers.authorization;
      if (authExists) {
        try {
          request.put(
            `${URL}/video/currentlyWatching`,
            { watchCode },
            authorization
          );
        } catch (error) {
          return handleError(error);
        }
      }
    },
    async updateTotalViewDuration({
      videoId,
      rewardLevel,
      xpEarned,
      watchCode
    }) {
      const authorization = auth();
      const authExists = !!authorization.headers.authorization;
      if (authExists) {
        try {
          const {
            data: { currentlyWatchingAnotherVideo, success }
          } = await request.put(
            `${URL}/video/duration`,
            {
              videoId,
              rewardLevel,
              xpEarned,
              watchCode
            },
            authorization
          );
          return Promise.resolve({ currentlyWatchingAnotherVideo, success });
        } catch (error) {
          console.error(error.response || error);
        }
      } else {
        return { notLoggedIn: true };
      }
    },
    async updateVideoXPEarned(videoId) {
      try {
        await request.put(`${URL}/video/xpEarned`, { videoId }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadBio(params) {
      try {
        const { data } = await request.post(`${URL}/user/bio`, params, auth());
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadComment({ content, parent, rootCommentId, targetCommentId }) {
      try {
        const { data } = await request.post(
          `${URL}/content/comments`,
          { content, parent, rootCommentId, targetCommentId },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadContent({
      attachment,
      url,
      isVideo,
      title,
      description,
      rewardLevel,
      secretAnswer
    }) {
      try {
        const { data } = await request.post(
          `${URL}/content`,
          {
            attachment,
            url,
            isVideo,
            title,
            description,
            rewardLevel,
            secretAnswer
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadFeaturedSubjects({ selected }) {
      try {
        const challenges = await request.post(
          `${URL}/content/featured/subjects`,
          { selectedSubjects: selected },
          auth()
        );
        return Promise.resolve(challenges);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadFeaturedPlaylists({ selectedPlaylists }) {
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
        return handleError(error);
      }
    },
    async uploadFileOnChat({
      channelId,
      content,
      selectedFile,
      onUploadProgress,
      recepientId,
      path,
      subjectId
    }) {
      try {
        const fileData = new FormData();
        fileData.append('file', selectedFile, selectedFile.name);
        fileData.append('path', path);
        fileData.append('channelId', channelId);
        fileData.append('recepientId', recepientId);
        fileData.append('content', content);
        if (subjectId) {
          fileData.append('subjectId', subjectId);
        }
        const { data } = await request.post(`${URL}/chat/file`, fileData, {
          ...auth(),
          onUploadProgress
        });
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadGreeting({ greeting }) {
      try {
        await request.put(`${URL}/user/greeting`, { greeting }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadProfileInfo({ email, website, youtubeName, youtubeUrl }) {
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
        return handleError(error);
      }
    },
    async uploadProfilePic({ image }) {
      try {
        const { data } = await request.post(
          `${URL}/user/picture`,
          { image },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadQuestions({ questions, videoId }) {
      const data = {
        videoId,
        questions: questions.map(question => {
          const choices = question.choiceIds
            .map(id => ({ id, label: question.choicesObj[id] }))
            .filter(choice => choice.label && !stringIsEmpty(choice.label));
          return {
            videoId,
            title: question.title,
            correctChoice:
              choices.map(choice => choice.id).indexOf(question.correctChoice) +
              1,
            choice1: choices[0].label,
            choice2: choices[1].label,
            choice3: choices[2]?.label,
            choice4: choices[3]?.label,
            choice5: choices[4]?.label
          };
        })
      };
      try {
        await request.post(`${URL}/video/questions`, data, auth());
        const questions = data.questions.map(question => {
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
        return Promise.resolve(questions);
      } catch (error) {
        handleError(error);
      }
    },
    async uploadSubject({
      contentType,
      contentId,
      title,
      description,
      rewardLevel,
      secretAnswer
    }) {
      try {
        const { data } = await request.post(
          `${URL}/content/subjects`,
          {
            title,
            description,
            contentId,
            rewardLevel,
            secretAnswer,
            contentType
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadPlaylist({ title, description, selectedVideos }) {
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
        return handleError(error);
      }
    },
    async sendVerificationEmail() {
      try {
        const { data } = await request.put(
          `${URL}/user/email/verify`,
          undefined,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async verifyEmail({ token }) {
      try {
        const {
          data: { username, errorMsg }
        } = await request.get(
          `${URL}/user/email/verify?token=${token}`,
          auth()
        );
        return Promise.resolve({ username, errorMsg });
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
