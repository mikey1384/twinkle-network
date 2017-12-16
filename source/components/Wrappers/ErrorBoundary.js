import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  state = { hasError: false }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    console.log(error, info)
  }

  render() {
    const { children, ...props } = this.props
    const { hasError } = this.state
    if (hasError) {
      return <h1 style={{ color: 'red' }}>Something went wrong.</h1>
    }
    return <div {...props}>{children}</div>
  }
}
