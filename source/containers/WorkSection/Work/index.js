import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Work extends Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/videos">to Videos</Link>
        </div>
        <div>
          <Link to="/links">to Links</Link>
        </div>
      </div>
    );
  }
}
