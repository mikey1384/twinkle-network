import PropTypes from 'prop-types'
import React from 'react'
import LinkItem from './LinkItem'
import { css } from 'emotion'

LinkGroup.propTypes = {
  links: PropTypes.array.isRequired
}
export default function LinkGroup({ links }) {
  return (
    <div
      className={css`
        nav {
          margin-bottom: 2rem;
        }
      `}
    >
      {links.map(link => <LinkItem key={link.id} link={link} />)}
    </div>
  )
}
