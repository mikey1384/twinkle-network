import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import NotFound from 'components/NotFound'
import Content from './Content'
import { contentPage } from './Styles'

CommentPage.propTypes = {
  match: PropTypes.object.isRequired
}
export default function CommentPage({ match }) {
  return (
    <div className={contentPage}>
      <section>
        <Switch>
          <Route exact path={`${match.url}/:contentId`} component={Content} />
          <Route component={NotFound} />
        </Switch>
      </section>
    </div>
  )
}
