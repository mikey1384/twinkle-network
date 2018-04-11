import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import Notification from 'components/Notification'
import ProfileWidget from 'components/ProfileWidget'
import HomeMenuItems from 'components/HomeMenuItems'
import { borderRadius, Color } from 'constants/css'
import { container, Left, Center, Right } from './Styles'
import { css } from 'react-emotion'
import Loading from 'components/Loading'
import loadable from 'loadable-components'
const Profile = loadable(() => import('./Profile'), {
  LoadingComponent: Loading
})
const People = loadable(() => import('./People'), {
  LoadingComponent: Loading
})
const Stories = loadable(() => import('./Stories'), {
  LoadingComponent: Loading
})

class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
  }
  render() {
    const { history, location } = this.props
    return (
      <div className={container}>
        <div className={Left}>
          <ProfileWidget history={history} />
          <HomeMenuItems
            style={{ marginTop: '1rem' }}
            history={history}
            location={location}
          />
        </div>
        <div className={Center}>
          <Route exact path="/" component={Stories} />
          <Route path="/users/:username" component={Profile} />
          <Route exact path="/users" component={People} />
        </div>
        <Notification className={Right}>
          <div
            className={css`
              width: 100%;
              margin-bottom: 0px;
              text-align: center;
              padding: 1rem;
              background: #fff;
              border: 1px solid #eeeeee;
              border-radius: ${borderRadius};
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
              <span style={{ color: Color.logoBlue() }}>Twin</span>
              <span style={{ color: Color.logoGreen() }}>kle</span>&nbsp;
              <span style={{ color: Color.gold() }}>XP!</span>
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
