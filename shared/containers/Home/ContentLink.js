import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {loadVideoPageFromClientSideAsync} from 'redux/actions/VideoActions';

@connect(
  null,
  {
    loadVideoPage: loadVideoPageFromClientSideAsync
  }
)
export default class ContentLink extends Component {
  render() {
    const {content, loadVideoPage} = this.props;
    return (
      <span
        style={{
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#158cba'
        }}
        onClick={event => {
          event.preventDefault();
          loadVideoPage(content.id, `videos/${content.id}`);
        }}
        href={`videos/${content.id}`}
      >
        {content.title}
      </span>
    )
  }
}
