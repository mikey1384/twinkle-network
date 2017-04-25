import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Color} from 'constants/css'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'
import {clearFeeds} from 'redux/actions/FeedActions'
import Profile from './Profile'
import Feeds from './Feeds'

@connect(
  state => ({
    username: state.UserReducer.username
  }),
  {clearFeeds}
)
export default class Home extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.object,
    username: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      selectedTab: null
    }
  }

  componentDidMount() {
    const {match} = this.props
    this.setState({selectedTab: match.params.username ? 'profile' : 'feed'})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.setState({
        selectedTab: this.props.match.params.username ? 'profile' : 'feed'
      })
    }
  }

  render() {
    const {username, history} = this.props
    const {selectedTab} = this.state
    const listStyle = {
      profile: {
        cursor: 'pointer',
        backgroundColor: selectedTab === 'profile' ? Color.lightGray : Color.backgroundGray,
        border: 'none',
        fontWeight: selectedTab === 'profile' && 'bold'
      },
      feed: {
        cursor: 'pointer',
        backgroundColor: selectedTab === 'feed' ? Color.lightGray : Color.backgroundGray,
        border: 'none',
        fontWeight: selectedTab === 'feed' && 'bold'
      }
    }
    return (
      <div className="container-fluid">
        <div
          className="col-md-offset-1 col-xs-2"
          style={{
            marginTop: '2em',
            position: 'fixed'
          }}
        >
          <ul className="list-group unselectable" style={{fontSize: '1.3em'}}>
            <li
              className="list-group-item left-menu-item"
              style={listStyle.profile}
              onClick={() => {
                history.push(`/${username}`)
              }}
            >
              <a
                style={{
                  textDecoration: 'none',
                  color: selectedTab === 'profile' ? Color.black : Color.darkGray
                }}
              >
                Profile
              </a>
            </li>
            <li
              className="list-group-item left-menu-item"
              style={listStyle.feed}
              onClick={() => history.push('/')}
            >
              <a
                style={{
                  textDecoration: 'none',
                  color: selectedTab === 'feed' ? Color.black : Color.darkGray
                }}
              >
                News Feed
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-6 col-md-offset-4 col-xs-10 col-xs-offset-2">
          <Route exact path="/" component={Feeds}/>
          <Route path="/:username" component={Profile}/>
        </div>
      </div>
    )
  }
}
