import React, {PropTypes} from 'react'
import Link from './Link'

LinkGroup.propTypes = {
  links: PropTypes.array
}
export default function LinkGroup({links}) {
  return (
    <ul className="media-list" style={{marginBottom: '1.5em'}}>
      {links.map(link => <Link key={link.id} link={link} />)}
    </ul>
  )
}
