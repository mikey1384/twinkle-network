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
      <a
        style={{
          fontWeight: 'bold', cursor: 'pointer'
        }}
        onClick={event => {
          event.preventDefault();
          loadVideoPage(content.id, `videos/${content.id}`);
        }}
        href={`videos/${content.id}`}
      >
        {content.title}
      </a>
    )
  }
}
