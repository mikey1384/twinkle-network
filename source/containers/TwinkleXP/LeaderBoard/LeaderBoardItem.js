import React from 'react'
import PropTypes from 'prop-types'
import {Color} from 'constants/css'
import UsernameText from 'components/Texts/UsernameText'
import {connect} from 'react-redux'

LeaderBoardItem.propTypes = {
  myId: PropTypes.number,
  user: PropTypes.object.isRequired
}
function LeaderBoardItem({myId, user}) {
  const profileUrl = user.profilePicId ?
  `https://s3.ap-northeast-2.amazonaws.com/twinkle-seoul/pictures/${user.id}/${user.profilePicId}.jpg` :
  '/img/default.png'
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem'
      }}
    >
      <img
        alt='thumbnail'
        style={{width: '20%', height: '20%', borderRadius: '50%'}}
        src={profileUrl}
      />
      <div
        style={{
          padding: '0 1rem 0 1rem',
          width: '80%',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{fontSize: '1.2em', display: 'inline'}}
        >
          <UsernameText
            color={Color.logoBlue}
            user={{...user, name: user.username}}
            userId={myId}
          />
        </div>
        <div
          style={{
            fontSize: '1.2em',
            fontWeight: 'bold',
            display: 'inline'
          }}
        >
          <span style={{color: Color.logoGreen}}>
            {user.twinkleXP ? user.twinkleXP : 0}
          </span>
          &nbsp;
          <span
            style={{
              color: Color.orange
            }}
          >
            XP
          </span>
        </div>
      </div>
    </div>
  )
}

export default connect(state => ({myId: state.UserReducer.userId}))(LeaderBoardItem)
