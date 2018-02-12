import { Color } from 'constants/css'

export const Style = {
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    marginTop: '1.5rem',
    position: 'relative'
  },
  dropdownWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    position: 'absolute'
  },
  profilePic: { width: '7%', height: '7%' },
  contentWrapper: { display: 'flex', width: '100%', position: 'relative' },
  timeStamp: { color: Color.gray },
  innerContentWrapper: { width: '100%', marginLeft: '2%' },
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
