import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

export const MessageStyle = {
  container: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 0;
    position: relative;
  `,
  profilePic: css`
    width: 5vw;
    height: 5vw;
    @media (max-width: ${mobileMaxWidth}) {
      width: 6vw;
      height: 5.8vw;
    }
  `,
  contentWrapper: css`
    width: CALC(100% - 5vw - 3rem);
    display: flex;
    flex-direction: column;
    margin-left: 2rem;
    margin-right: 1rem;
    position: relative;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
    @media (max-width: ${mobileMaxWidth}) {
      margin-left: 1rem;
    }
  `,
  usernameText: { fontSize: '1.8rem', lineHeight: '100%' },
  messageWrapper: css`
    margin-top: 0.5rem;
    position: relative;
  `,
  timeStamp: css`
    font-size: 1rem;
    color: ${Color.gray()};
    @media (max-width: ${mobileMaxWidth}) {
      font-size: 0.8rem;
    }
  `,
  relatedConversationsButton: css`
    margin-top: 1rem;
  `,
  subjectPrefix: css`
    font-weight: bold;
    color: ${Color.green()};
  `
};
