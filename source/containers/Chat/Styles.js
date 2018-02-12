import { Color } from 'constants/css'
import { css } from 'react-emotion'

export const MessageStyle = {
  container: css`
    display: flex;
    width: 98%;
    padding: 1rem 0;
    min-height: 8rem;
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
