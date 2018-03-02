import PropTypes from 'prop-types'
import React from 'react'
import LinkItem from './LinkItem'
import { linkGroup } from './Styles'

LinkGroup.propTypes = {
  links: PropTypes.array.isRequired
}
export default function LinkGroup({ links }) {
  return (
    <div className={linkGroup}>
      {links.map(link => <LinkItem key={link.id} link={link} />)}
    </div>
  )
}
