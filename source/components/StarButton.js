import React from 'react'
import Button from 'components/Button'

export default function StarButton(props) {
  return (
    <Button {...props} className="btn btn-danger btn-sm">
      <span className="glyphicon glyphicon-star"></span>
    </Button>
  )
}
