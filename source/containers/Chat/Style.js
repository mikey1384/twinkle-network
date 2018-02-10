import { Color } from 'constants/css'

export const Style = {
  container: { display: 'flex', width: '98%', padding: '1rem 0', minHeight: '8rem' },
  profilePic: { width: '7%', height: '7%' },
  contentWrapper: {
    marginLeft: '1.3rem',
    width: '92%',
    wordBreak: 'break-word'
  },
  usernameText: { fontSize: '1.8rem', lineHeight: '100%' },
  messageWrapper: { marginTop: '0.5rem' },
  timeStamp: { fontSize: '1rem', color: Color.gray },
  relatedConversationsButton: { marginTop: '1rem' },
  subjectPrefix: { fontWeight: 'bold', color: Color.green }
}
