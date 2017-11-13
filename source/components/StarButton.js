import React from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'

StarButton.propTypes = {
  isStarred: PropTypes.bool,
  onClick: PropTypes.func
}
export default function StarButton({isStarred, onClick, ...props}) {
  return (
    <Button
      {...props}
      className={`btn btn-${isStarred ? 'danger' : 'default'} btn-sm`}
      onClick={onClick}
    >
      <span className="glyphicon glyphicon-star"></span>
    </Button>
  )
}
