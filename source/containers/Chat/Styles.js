import { Color, mobileMaxWidth } from 'constants/css'
import { css } from 'react-emotion'

export const chatStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 1rem;
  font-size: 1.5rem;
  position: relative;
  @media (max-width: ${mobileMaxWidth}) {
    height: CALC(100% - 2rem);
  }
`

export const channelContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  height: CALC(100% - 1rem);
  width: 25%;
  position: relative;
  background: #fff;
`

export const chatContainer = css`
  height: CALC(100% - 1rem);
  margin-top: 1rem;
  width: CALC(75% - 2rem);
  margin-left: 1rem;
  padding: 1rem;
  position: relative;
  background: #fff;
`

export const MsgContainerStyle = {
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: CALC(100% - 5rem);
    position: relative;
  `,
  messagesWrapper: css`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `
}

export const MessageStyle = {
  container: css`
    display: flex;
    width: 100%;
    padding: 1rem;
    position: relative;
  `,
  profilePic: { width: '7%', height: '7%' },
  contentWrapper: css`
    margin-left: 1.3rem;
    width: 92%;
    position: relative;
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
}
