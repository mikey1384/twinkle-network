import React, {Component} from 'react';
import { connect } from 'react-redux';
import { loadVideoPage, resetVideoPage } from 'actions/VideoActions';

@connect(
  state => ({...state.VideoReducer.videoPage})
)
export default class VideoPage extends Component {
  componentWillUnmount() {
    this.props.dispatch(resetVideoPage())
  }

  render() {
    return (
      <div>
        {`${this.props.title}`}
      </div>
    )
  }
}
