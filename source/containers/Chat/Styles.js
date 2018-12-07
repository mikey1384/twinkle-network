import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

export const chatStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 1rem;
  font-size: 1.5rem;
  position: relative;
  @media (max-width: ${mobileMaxWidth}) {
    width: CALC(100vw - 1rem);
    height: CALC(100% - 2rem);
  }
`;

export const channelContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  height: CALC(100vh - 8rem);
  width: 25%;
  position: relative;
  background: #fff;
  -webkit-overflow-scrolling: touch;
  @media (max-width: ${mobileMaxWidth}) {
    width: 30%;
    height: CALC(100% - 1rem);
  }
`;

export const MessageStyle = {
  container: css`
    display: flex;
    width: 100%;
    padding: 1rem 0;
    position: relative;
  `,
  profilePic: css`
    width: 7rem;
    height: 7rem;
    @media (max-width: ${mobileMaxWidth}) {
      width: 5rem;
      height: 5rem;
    }
  `,
  contentWrapper: css`
    margin-left: 1.3rem;
    width: 92%;
    position: relative;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
  `,
  usernameText: { fontSize: '1.8rem', lineHeight: '100%' },
  messageWrapper: css`
    margin-top: 0.5rem;
    position: relative;
  `,
  timeStamp: css`
    font-size: 1rem;
    color: ${Color.gray()};
  `,
  relatedConversationsButton: css`
    margin-top: 1rem;
  `,
  subjectPrefix: css`
    font-weight: bold;
    color: ${Color.green()};
  `
};
