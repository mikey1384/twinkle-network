import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import Profile from './Profile'
import People from './People'
import Stories from './Stories'
import Notification from 'components/Notification'
import ProfileWidget from 'components/ProfileWidget'
import HomeMenuItems from 'components/HomeMenuItems'
import { Color } from 'constants/css'
import { Container, Left, Center, Right } from './Styles'
import { css } from 'react-emotion'

class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
  }
  render() {
    const { history, location } = this.props
    return (
      <div className={Container}>
        <div className={Left}>
          <ProfileWidget history={history} />
          <HomeMenuItems
            style={{ marginTop: '2rem' }}
            history={history}
            location={location}
          />
        </div>
        <div className={Center}>
          <section>
            <Route exact path="/" component={Stories} />
            <Route path="/users/:username" component={Profile} />
            <Route exact path="/users" component={People} />
          </section>
        </div>
        <Notification className={Right}>
          <div
            className={css`
              margin-bottom: 0px;
              text-align: center;
              padding: 1rem;
              background: #fff;
              border: 1px solid #eeeeee;
              border-radius: 5px;
              p {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 0px;
              }
              a {
                font-size: 1.5rem;
                font-weight: bold;
              }
            `}
          >
            <p>
              <span style={{ color: Color.logoGreen }}>Twin</span>
              <span style={{ color: Color.logoBlue }}>kle</span>&nbsp;
              <span style={{ color: Color.orange }}>XP!</span>
            </p>
            <Link to="/twinklexp">Click here to learn how to earn them</Link>
          </div>
        </Notification>
      </div>
    )
  }
}

export default connect(state => ({
  realName: state.UserReducer.realName,
  username: state.UserReducer.username,
  userId: state.UserReducer.userId,
  profilePicId: state.UserReducer.profilePicId
}))(Home)
