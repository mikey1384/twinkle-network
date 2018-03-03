import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Color } from 'constants/css'

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
      return <span style={{ color: Color.red() }}>Something went wrong.</span>
    }
    return <div {...props}>{children}</div>
  }
}
