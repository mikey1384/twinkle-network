import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  };
  render() {
    const { item } = this.props;
    return (
      <div>
        <span>{item.label}: </span>
        <span>{item.value}</span>
      </div>
    );
  }
}
