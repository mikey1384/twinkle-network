import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import NotFound from 'components/NotFound'
import Content from './Content'

CommentPage.propTypes = {
  match: PropTypes.object.isRequired
}
export default function CommentPage({ match }) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '90%' }}>
        <Switch>
          <Route exact path={`${match.url}/:commentId`} component={Content} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  )
}
