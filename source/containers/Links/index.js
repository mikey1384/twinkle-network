import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router-dom'
import Loading from 'components/Loading'
import loadable from 'loadable-components'
const LinkPage = loadable(() => import('./LinkPage'), {
  LoadingComponent: Loading
})
const Main = loadable(() => import('./Main'), {
  LoadingComponent: Loading
})

Links.propTypes = {
  match: PropTypes.object.isRequired
}
export default function Links({ match }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Route exact path={`${match.url}`} component={Main} />
      <Route path={`${match.url}/:linkId`} component={LinkPage} />
    </div>
  )
}
