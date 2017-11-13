import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

StarButton.propTypes = {
  isStarred: PropTypes.number
}
export default function StarButton({isStarred, ...props}) {
  return (
    <Button {...props} className={`btn btn-${isStarred ? 'danger' : 'default'} btn-sm`}>
      <span className="glyphicon glyphicon-star"></span>
    </Button>
  )
}
