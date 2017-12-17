import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router-dom'
import LinkPage from './LinkPage'
import Main from './Main'

Links.propTypes = {
  match: PropTypes.object.isRequired
}
export default function Links({ match }) {
  return (
    <div id="contents">
      <Route exact path={`${match.url}`} component={Main} />
      <Route path={`${match.url}/:linkId`} component={LinkPage} />
    </div>
  )
}
