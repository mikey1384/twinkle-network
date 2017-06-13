import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import Main from './Main'
import VideoPage from './VideoPage'

export default class Videos extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  render() {
    const {match} = this.props
    return (
      <div id="contents">
        <Route exact path={`${match.url}`} component={Main}/>
        <Route path={`${match.url}/:videoId`} component={VideoPage}/>
      </div>
    )
  }
}
