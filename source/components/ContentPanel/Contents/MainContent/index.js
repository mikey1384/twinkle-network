import React from 'react'
import PropTypes from 'prop-types'
import Content from './Content'

MainContent.propTypes = {
  type: PropTypes.string.isRequired
}
export default function MainContent({ type, ...props }) {
  return (
    <div>
      <Content type={type} {...props} />
    </div>
  )
}
