import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
    console.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      return <h1 style={{color: 'red'}}>Something went wrong.</h1>
    }
    return this.props.children
  }
}
