import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';

export default class ContactItems extends Component {
  static propTypes = {
    email: PropTypes.string,
    youtube: PropTypes.string,
    style: PropTypes.object
  };
  render() {
    const { email, youtube, style } = this.props;
    return (
      <div style={style}>
        {[
          { key: 'email', label: 'Email', value: email },
          { key: 'youtube', label: 'YouTube', value: youtube }
        ].map(item => (
          <Item key={item.key} item={item} />
        ))}
      </div>
    );
  }
}
