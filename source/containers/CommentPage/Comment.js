import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Comment extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  }
  render() {
    const { match: { params: { commentId } } } = this.props
    return <div>CommentId is {commentId}</div>
  }
}
