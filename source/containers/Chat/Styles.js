import { Color, mobileMaxWidth } from 'constants/css'
import { css } from 'react-emotion'

export const chatStyle = css`
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  padding-left: 1rem;
  align-items: top;
  background-color: #fff;
  z-index: 1000;
  @media (max-width: ${mobileMaxWidth}) {
    top: 9rem;
  }
`

export const channelContainer = css`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  margin-top: 1rem;
  height: CALC(100% - 2rem);
  width: 25%;
  position: relative;
`

export const MsgContainerStyle = {
  container: css`
    width: 100%;
    height: CALC(100% - 4.5rem);
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
  `,
  profilePic: { width: '7%', height: '7%' },
  contentWrapper: css`
    margin-left: 1.3rem;
    width: 92%;
    word-break: break-word;
  `,
  usernameText: { fontSize: '1.8rem', lineHeight: '100%' },
  messageWrapper: css`
    margin-top: 0.5rem;
  `,
  timeStamp: css`
    font-size: 1rem;
    color: ${Color.gray};
  `,
  relatedConversationsButton: css`
    margin-top: 1rem;
  `,
  subjectPrefix: css`
    font-weight: bold;
    color: ${Color.green};
  `
}
