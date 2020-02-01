import request from 'axios';
import URL from 'constants/URL';
import { clientVersion } from 'constants/defaultValues';

export default function notificationRequestHelpers({ auth, handleError }) {
  return {
    async checkVersion() {
      try {
        const { data } = await request.get(
          `${URL}/notification/version?version=${clientVersion}`
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
        return handleError(error);
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
        return handleError(error);
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
        return handleError(error);
      }
    }
  };
}
