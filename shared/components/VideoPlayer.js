import React, {Component} from 'react';
import YouTube from 'react-youtube';
import {connect} from 'react-redux';
import {addVideoViewAsync} from 'redux/actions/VideoActions';

@connect(
  state => ({
    userId: state.UserReducer.userId
  }),
  {addVideoView: addVideoViewAsync}
)
export default class VideoPlayer extends Component {
  constructor() {
    super()
    this.state = {
      playing: false
    }
    this.onVideoReady = this.onVideoReady.bind(this)
  }

  render() {
    const {videoCode, title, containerClassName, className, style, autoplay, small} = this.props;
    const {playing} = this.state;
    return (
      <div
        className={small ? containerClassName : `video-player ${containerClassName}`}
        style={{...style, cursor: !playing && 'pointer'}}
        onClick={() => {if (!playing) this.setState({playing: true})}}
      >
        {!autoplay && !small && <div>
            <img
              className="embed-responsive-item"
              src={`https://img.youtube.com/vi/${videoCode}/0.jpg`}
            />
            <a></a>
          </div>
        }
        {(!!playing || !!autoplay) && <YouTube
          className={className}
          opts={{
            title: title,
            height: '360',
            width: '640'
          }}
          videoId={videoCode}
          onReady={this.onVideoReady}
        />}
      </div>
    )
  }

  onVideoReady(event) {
    const {videoId, userId, addVideoView} = this.props;
    event.target.playVideo()
    const time = event.target.getCurrentTime()
    if (Math.floor(time) === 0) {
      addVideoView({videoId, userId})
    }
  }
}
