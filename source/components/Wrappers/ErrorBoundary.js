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
      return (
        <div
          style={{
            color: Color.darkGray(),
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            height: '30%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Something went wrong
        </div>
      )
    }
    return <div {...props}>{children}</div>
  }
}
