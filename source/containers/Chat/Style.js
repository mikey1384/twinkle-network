import { Color } from 'constants/css'

export const Style = {
  container: { display: 'flex', width: '98%', padding: '1rem 0' },
  profilePicWrapper: { width: '8%', height: '8%' },
  profilePic: { width: '80%', height: '80%' },
  contentWrapper: {
    width: '92%',
    wordBreak: 'break-word'
  },
  usernameText: { fontSize: '1.8rem', lineHeight: '100%' },
  messageWrapper: { marginTop: '0.5rem' },
  timeStamp: { fontSize: '1rem', color: Color.gray },
  relatedConversationsButton: { marginTop: '1rem' },
  subjectPrefix: { fontWeight: 'bold', color: Color.green }
}
