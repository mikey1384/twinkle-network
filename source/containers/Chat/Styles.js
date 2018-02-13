import { Color } from 'constants/css'
import { css } from 'react-emotion'

export const Container = css`
  display: flex;
  padding-left: 1rem;
  height: CALC(100% - 54px);
  width: 100%;
  align-items: center;
  background-color: #fff;
`

export const ChannelContainer = css`
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  paddingtop: 1rem;
  height: CALC(100% - 2rem);
  width: 25%;
  position: relative;
`

export const MsgContainerStyle = {
  container: css`
    width: 100%;
    height: 100%;
    position: relative;
  `,
  messagesWrapper: css`
    position: absolute;
    bottom: 5rem;
    left: 0;
    right: 0;
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
