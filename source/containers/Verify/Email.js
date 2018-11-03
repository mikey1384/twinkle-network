import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Email extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { match } = this.props;
    console.log(match?.params?.token);
  }

  render() {
    const { match } = this.props;
    return <div>{match?.params?.token}</div>;
  }
}
