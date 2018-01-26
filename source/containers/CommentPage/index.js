import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import NotFound from 'components/NotFound'
import Comment from './Comment'

CommentPage.propTypes = {
  match: PropTypes.object.isRequired
}
export default function CommentPage({ match }) {
  return (
    <div>
      <Switch>
        <Route
          exact path={`${match.url}/:commentId`}
          component={Comment}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
