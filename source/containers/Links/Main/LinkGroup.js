import PropTypes from 'prop-types'
import React from 'react'
import LinkItem from './LinkItem'

LinkGroup.propTypes = {
  links: PropTypes.array
}
export default function LinkGroup({links}) {
  return (
    <ul className="media-list" style={{marginBottom: '1.5em'}}>
      {links.map(link => <LinkItem key={link.id} link={link} />)}
    </ul>
  )
}
