import { Color } from 'constants/css'

export const Style = {
  container: { display: 'flex', width: '100%', flexDirection: 'column' },
  dropdownWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  dropdownButton: { position: 'absolute' },
  profilePic: { width: '8%', height: '8%' },
  contentWrapper: { display: 'flex', width: '100%' },
  timeStamp: { color: Color.gray },
  innerContentWrapper: { width: '90%', marginLeft: '2%' },
  toText: { color: Color.blue },
  usernameText: { fontSize: '1.7rem' },
  longText: {
    wordBreak: 'break-word',
    margin: '0.5rem 0 1rem 0'
  },
  replyButton: { marginLeft: '0.5rem' },
  likers: {
    marginTop: '0.5rem',
    fontWeight: 'bold',
    color: Color.green
  }
}
