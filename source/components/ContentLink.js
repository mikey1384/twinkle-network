import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { Color } from 'constants/css'

ContentLink.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string
  }).isRequired,
  style: PropTypes.object,
  type: PropTypes.string
}
export default function ContentLink({ style, content: { id, title }, type, ...actions }) {
  let destination = ''
  switch (type) {
    case 'url':
      destination = 'links'
      break
    case 'discussion':
      destination = 'discussions'
      break
    case 'video':
      destination = 'videos'
      break
    case 'comment':
      destination = 'comments'
      break
    case 'question':
      destination = 'questions'
      break
    default:
      break
  }

  return title ? (
    <Link
      style={{
        fontWeight: 'bold',
        color: Color.blue(),
        ...style
      }}
      to={`/${destination}/${id}`}
    >
      {title}
    </Link>
  ) : (
    <span style={{ fontWeight: 'bold', color: Color.darkGray() }}>
      (Deleted)
    </span>
  )
}
