import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {loadRightMenuVideos} from 'redux/actions/VideoActions'
import {Link} from 'react-router-dom'
import {Color} from 'constants/css'

@connect(
  state => ({
    nextVideos: state.VideoReducer.videoPage.nextVideos,
    relatedVideos: state.VideoReducer.videoPage.relatedVideos,
    popularVideos: state.VideoReducer.videoPage.popularVideos
  }),
  {
    loadRightMenuVideos
  }
)
export default class RightMenu extends Component {
  static propTypes = {
    loadRightMenuVideos: PropTypes.func,
    videoId: PropTypes.number,
    nextVideos: PropTypes.array,
    relatedVideos: PropTypes.array,
    popularVideos: PropTypes.array
  }

  componentDidMount() {
    const {loadRightMenuVideos, videoId} = this.props
    loadRightMenuVideos(videoId)
  }

  componentDidUpdate(prevProps) {
    const {loadRightMenuVideos, nextVideos} = this.props
    if (!nextVideos || (this.props.videoId && (prevProps.videoId !== this.props.videoId))) {
      loadRightMenuVideos(this.props.videoId)
    }
  }

  render() {
    const {nextVideos = [], relatedVideos = [], popularVideos = []} = this.props
    const noVideos = nextVideos.length + relatedVideos.length + popularVideos.length === 0
    return (
      <div>
        {!noVideos &&
          <div
            className="col-xs-offset-8 col-xs-4"
            style={{
              width: '30%',
              backgroundColor: '#fff',
              position: 'absolute',
              paddingBottom: '2em'
            }}
          >
            <div>
              {nextVideos.length > 0 && <h3>Up Next</h3>}
              {nextVideos.map(video => (
                <div
                  key={video.id}
                  className="media"
                >
                  <div className="media-left media-middle">
                    <Link to={`/videos/${video.videoId}`}>
                      <img
                        className="media-object"
                        src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
                        alt="..."
                        style={{width: '18rem'}}
                      />
                    </Link>
                  </div>
                  <div className="media-body">
                    <Link to={`/videos/${video.videoId}`}>
                      <p style={{fontSize: '1.2em'}} className="media-heading">{video.title}</p>
                    </Link>
                    <small style={{color: Color.gray}}>Uploaded by {video.username}</small>
                  </div>
                </div>
              ))}
              {relatedVideos.length > 0 && <h3>Related Videos</h3>}
              {relatedVideos.map(video => (
                <div
                  key={video.id}
                  className="media"
                >
                  <div className="media-left media-middle">
                    <Link to={`/videos/${video.videoId}`}>
                      <img
                        className="media-object"
                        src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
                        alt="..."
                        style={{width: '18rem'}}
                      />
                    </Link>
                  </div>
                  <div className="media-body">
                    <Link to={`/videos/${video.videoId}`}>
                      <p style={{fontSize: '1.2em'}} className="media-heading">{video.title}</p>
                    </Link>
                    <small style={{color: Color.gray}}>Uploaded by {video.username}</small>
                  </div>
                </div>
              ))}
              {popularVideos.length > 0 && <h3>Popular Videos</h3>}
              {popularVideos.map(video => (
                <div
                  key={video.videoId}
                  className="media"
                >
                  <div className="media-left media-middle">
                    <Link to={`/videos/${video.videoId}`}>
                      <img
                        className="media-object"
                        src={`https://img.youtube.com/vi/${video.content}/mqdefault.jpg`}
                        alt="..."
                        style={{width: '18rem'}}
                      />
                    </Link>
                  </div>
                  <div className="media-body">
                    <Link to={`/videos/${video.videoId}`}>
                      <p style={{fontSize: '1.2em'}} className="media-heading">{video.title}</p>
                    </Link>
                    <small style={{color: Color.gray}}>Uploaded by {video.username}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    )
  }
}
