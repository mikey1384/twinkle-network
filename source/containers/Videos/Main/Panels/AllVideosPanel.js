import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import VideoThumb from 'components/VideoThumb'
import { connect } from 'react-redux'
import { getInitialVideos, getMoreVideos } from 'redux/actions/VideoActions'
import SectionPanel from 'components/SectionPanel'
import Button from 'components/Button'

const last = array => {
  return array[array.length - 1]
}

class AllVideosPanel extends Component {
  static propTypes = {
    getInitialVideos: PropTypes.func.isRequired,
    getMoreVideos: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    onAddVideoClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videos: PropTypes.array.isRequired
  }

  constructor() {
    super()
    this.loadMoreVideos = this.loadMoreVideos.bind(this)
  }

  componentDidMount() {
    const { getInitialVideos, location, loaded } = this.props
    if (location.action === 'PUSH' || !loaded) {
      getInitialVideos()
    }
  }

  render() {
    const {
      loadMoreButton,
      videos,
      title = 'All Videos',
      loaded,
      onAddVideoClick
    } = this.props
    return (
      <SectionPanel
        title={title}
        button={
          <Button
            className="btn btn-default pull-right"
            style={{ marginLeft: 'auto' }}
            onClick={() => onAddVideoClick()}
          >
            + Add Video
          </Button>
        }
        emptyMessage="No Videos"
        isEmpty={videos.length === 0}
        loaded={loaded}
        loadMoreButtonShown={loadMoreButton}
        loadMore={this.loadMoreVideos}
      >
        {videos.map((video, index) => {
          const editable = this.props.userId === video.uploaderId
          return (
            <VideoThumb
              to={`videos/${video.id}`}
              size="col-sm-3"
              key={video.id}
              arrayIndex={index}
              editable={editable}
              video={video}
              user={{ name: video.uploaderName, id: video.uploaderId }}
              lastVideoId={last(videos) ? last(videos).id : 0}
            />
          )
        })}
      </SectionPanel>
    )
  }

  loadMoreVideos() {
    const { videos, getMoreVideos } = this.props
    const lastId = last(videos) ? last(videos).id : 0
    return getMoreVideos(lastId)
  }
}

export default connect(
  state => ({
    loaded: state.VideoReducer.loaded,
    loadMoreButton: state.VideoReducer.loadMoreButton,
    videos: state.VideoReducer.allVideoThumbs
  }),
  {
    getInitialVideos,
    getMoreVideos
  }
)(withRouter(AllVideosPanel))
