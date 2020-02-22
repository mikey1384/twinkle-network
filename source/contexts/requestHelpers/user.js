import request from 'axios';
import URL from 'constants/URL';

export default function userRequestHelpers({ auth, handleError, token }) {
  return {
    async addAccountType(accountType) {
      try {
        const { data } = await request.post(
          `${URL}/user/accountType`,
          { accountType },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async addModerators(newModerators) {
      try {
        const { data } = await request.post(
          `${URL}/user/moderator`,
          { newModerators },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async changeAccountType({ userId, selectedAccountType }) {
      try {
        const { data } = await request.put(
          `${URL}/user/moderator`,
          { userId, selectedAccountType },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async changePassword({ userId, password }) {
      try {
        const { data } = await request.put(`${URL}/user/password`, {
          userId,
          password
        });
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async checkIfUserOnline(userId) {
      try {
        const {
          data: { online }
        } = await request.get(`${URL}/user/online?userId=${userId}`);
        return Promise.resolve(online);
      } catch (error) {
        return handleError(error);
      }
    },
    async deleteAccountType(accountTypeLabel) {
      try {
        const {
          data: { success }
        } = await request.delete(
          `${URL}/user/accountType?accountTypeLabel=${accountTypeLabel}`,
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
      }
    },
    async editAccountType({ label, editedAccountType }) {
      try {
        const {
          data: { success }
        } = await request.put(
          `${URL}/user/accountType`,
          {
            label,
            editedAccountType
          },
          auth()
        );
        return Promise.resolve(success);
      } catch (error) {
        return handleError(error);
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
        return handleError(error);
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
    async loadAccountTypes() {
      try {
        const { data } = await request.get(`${URL}/user/accountType`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadModerators() {
      try {
        const { data } = await request.get(`${URL}/user/moderator`);
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
    async loadProfile(userId) {
      try {
        const { data } = await request.get(`${URL}/user?userId=${userId}`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async loadProfileViaUsername(username) {
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
    async loadRankings() {
      try {
        const {
          data: { all, top30s }
        } = await request.get(`${URL}/user/leaderBoard`, auth());
        return Promise.resolve({ all, top30s });
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
        return handleError(error);
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
    async sendVerificationEmail({ email, userId, isPasswordReset }) {
      try {
        const { data } = await request.put(`${URL}/user/email/verify`, {
          email,
          userId,
          isPasswordReset
        });
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async setDefaultSearchFilter(filter) {
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
    async uploadBio(params) {
      try {
        const { data } = await request.post(`${URL}/user/bio`, params, auth());
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
    async uploadProfilePic() {
      try {
        const { data } = await request.post(
          `${URL}/user/picture`,
          null,
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
          data: { profilePicId, userId, username, errorMsg }
        } = await request.get(
          `${URL}/user/email/verify?token=${token}`,
          auth()
        );
        return Promise.resolve({ profilePicId, userId, username, errorMsg });
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
