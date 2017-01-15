import React, {Component} from 'react';
import YouTube from 'react-youtube';
import Loading from 'components/Loading';
import {Color} from 'constants/css';
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
        {!autoplay && !small && !playing && <div>
            <img
              className="embed-responsive-item"
              src={`https://img.youtube.com/vi/${videoCode}/0.jpg`}
            />
          </div>
        }
        {!!playing ?
          <Loading
            style={{
              color: Color.blue,
              fontSize: '3em',
              position: 'absolute',
              display: 'block',
              height: '40px',
              width: '40px',
              top: '50%',
              left: '50%',
              margin: '-20px 0 0 -20px'
            }}
          /> : <a></a>
        }
        {(!!playing || !!autoplay) &&
          <YouTube
            className={className}
            opts={{
              title: title,
              height: '360',
              width: '640'
            }}
            videoId={videoCode}
            onReady={this.onVideoReady}
          />
        }
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
