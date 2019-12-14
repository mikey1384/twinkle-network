import request from 'axios';
import URL from 'constants/URL';

export default function chatRequestHelpers({ auth, handleError }) {
  return {
    async changeChannelOwner({ channelId, newOwner }) {
      try {
        const {
          data: { notificationMsg }
        } = await request.put(
          `${URL}/chat/owner`,
          { channelId, newOwner },
          auth()
        );
        return Promise.resolve(notificationMsg);
      } catch (error) {
        return handleError(error);
      }
    },
    async createNewChat({ channelName, selectedUsers, isClosed }) {
      try {
        const { data } = await request.post(
          `${URL}/chat/channel`,
          { channelName, selectedUsers, isClosed },
          auth()
        );
        return Promise.resolve(data);
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
        return handleError(error);
      }
    },
    async editChannelSettings(params) {
      try {
        await request.put(`${URL}/chat/settings`, params, auth());
        return Promise.resolve();
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
    async getNumberOfUnreadMessages() {
      if (auth() === null) return;
      try {
        const {
          data: { numUnreads }
        } = await request.get(`${URL}/chat/numUnreads`, auth());
        return Promise.resolve(Number(numUnreads));
      } catch (error) {
        return handleError(error);
      }
    },
    async hideChat(channelId) {
      try {
        await request.post(`${URL}/chat/hideChat`, { channelId }, auth());
        return Promise.resolve();
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
        return handleError(error);
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
    async loadChatSubject() {
      try {
        const { data } = await request.get(`${URL}/chat/chatSubject`);
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
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
    async loadMoreChannels({ currentChannelId, shownIds }) {
      try {
        const { data } = await request.get(
          `${URL}/chat/more/channels?currentChannelId=${currentChannelId}&${shownIds
            .map(shownId => `shownIds[]=${shownId}`)
            .join('&')}`,
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
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
        return handleError(error);
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
        return handleError(error);
      }
    },
    async saveMessage({ message, targetMessageId }) {
      try {
        const {
          data: { messageId }
        } = await request.post(
          `${URL}/chat`,
          { message, targetMessageId },
          auth()
        );
        return Promise.resolve(messageId);
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
        return handleError(error);
      }
    },
    async searchChatSubject(text) {
      try {
        const { data } = await request.get(
          `${URL}/chat/search/subject?text=${text}`
        );
        return Promise.resolve(data);
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
    async updateChatLastRead(channelId) {
      try {
        await request.post(`${URL}/chat/lastRead`, { channelId }, auth());
        return Promise.resolve();
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadChatSubject({ channelId, content }) {
      try {
        const { data } = await request.post(
          `${URL}/chat/chatSubject`,
          { channelId, content },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    },
    async uploadFileOnChat({
      channelId,
      content,
      selectedFile,
      onUploadProgress,
      path,
      recepientId,
      targetMessageId,
      subjectId
    }) {
      try {
        const { data: url } = await request.get(
          `${URL}/chat/sign-s3?fileName=${selectedFile.name}&path=${path}`,
          auth()
        );
        await request.put(url.signedRequest, selectedFile, {
          onUploadProgress
        });
        const { data } = await request.post(
          `${URL}/chat/file`,
          {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            path,
            channelId,
            content,
            recepientId,
            targetMessageId,
            subjectId
          },
          auth()
        );
        return Promise.resolve(data);
      } catch (error) {
        return handleError(error);
      }
    }
  };
}
