import React from 'react'
import PropTypes from 'prop-types'
import ProfilePic from 'components/ProfilePic'
import {Color} from 'constants/css'
import Button from 'components/Button'
import {openSigninModal} from 'redux/actions/UserActions'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

ProfileWidget.propTypes = {
  history: PropTypes.object,
  myUsername: PropTypes.string,
  openSigninModal: PropTypes.func,
  profilePicId: PropTypes.number,
  realName: PropTypes.string,
  userId: PropTypes.number,
  username: PropTypes.string
}
function ProfileWidget({history, openSigninModal, userId, username, myUsername, profilePicId, realName}) {
  return (
    <div
      style={{
        paddingTop: '1em',
        paddingBottom: '1em',
        backgroundColor: '#fff'
      }}
    >
      <div
       className="col-xs-5"
       style={{float: 'left'}}
      >
        <ProfilePic
          size='8'
          userId={userId}
          profilePicId={profilePicId}
          style={{cursor: userId ? 'pointer' : 'default'}}
          onClick={() => userId ? history.push(`/users/${myUsername}`) : null}
        />
      </div>
      <div className="col-xs-7">
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '1.5em'
          }
        }>
          {myUsername ? <Link to={`/users/${myUsername}`}>{myUsername}</Link> : 'Log in to access all features!'}
        </div>
        {realName && <div style={{color: Color.gray}}>({realName})</div>}
        {userId &&
          <div style={{marginTop: '0.5em'}}>
            <div style={{fontWeight: 'bold'}}><span>439</span>
              &nbsp;<span style={{color: Color.logoGreen}}>Twin</span><span style={{color: Color.logoBlue}}>kle</span>
              &nbsp;<span style={{color: Color.orange}}>Coins</span>
            </div>
            <div>Lvl 5 (Rank #3)</div>
          </div>
        }
        {!userId && <Button
          className="btn btn-success"
          style={{marginTop: '1em'}}
          onClick={openSigninModal}
        >
          Log In / Sign Up
        </Button>}
      </div>
      <div className="clearfix"></div>
    </div>
  )
}

export default connect(null, {openSigninModal})(ProfileWidget)
