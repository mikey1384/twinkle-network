import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import NotFound from 'components/NotFound'
import Content from './Content'
import { css } from 'emotion'
import { mobileMaxWidth } from 'constants/css'

CommentPage.propTypes = {
  match: PropTypes.object.isRequired
}
export default function CommentPage({ match }) {
  return (
    <div
      className={css`
        width: 100%;
        display: flex;
        justify-content: center;
      `}
      style={{ marginBottom: '1rem' }}
    >
      <section
        className={css`
          width: 65%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <Switch>
          <Route exact path={`${match.url}/:contentId`} component={Content} />
          <Route component={NotFound} />
        </Switch>
      </section>
    </div>
  )
}
