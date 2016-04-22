import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class AdminOnly extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount () {
      if (!this.props.isAdmin) {
        this.context.router.push('/');
      }
    }

    componentWillUpdate (nextProps) {
      if (!nextProps.isAdmin) {
        this.context.router.push('/');
      }
    }

    render () {
      const { isAdmin } = this.props;
      return isAdmin ?
      <ComposedComponent {...this.props} /> : null
    }
  }

  return connect(
    state => ({
      isAdmin: state.UserReducer.isAdmin
    })
  )(AdminOnly);
}
