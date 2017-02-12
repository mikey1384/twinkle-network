import React, {Component, PropTypes} from 'react'
import VideoThumb from 'components/VideoThumb'
import {connect} from 'react-redux'
import {getMoreVideos} from 'redux/actions/VideoActions'
import SectionPanel from 'components/SectionPanel'
import Button from 'components/Button'

const last = (array) => {
  return array[array.length - 1]
}

@connect(
  null,
  {getMoreVideos}
)
export default class AllVideosPanel extends Component {
  static propTypes = {
    videos: PropTypes.array.isRequired,
    onAddVideoClick: PropTypes.func.isRequired,
    title: PropTypes.string,
    loadMoreButton: PropTypes.bool,
    loaded: PropTypes.bool,
    userId: PropTypes.number,
    getMoreVideos: PropTypes.func
  }

  constructor() {
    super()
    this.loadMoreVideos = this.loadMoreVideos.bind(this)
  }

  render() {
    const {loadMoreButton, videos, title = 'All Videos', loaded, onAddVideoClick} = this.props
    return (
      <SectionPanel
        title={title}
        button={<Button
          className="btn btn-default pull-right"
          style={{marginLeft: 'auto'}}
          onClick={() => onAddVideoClick()}
        >+ Add Video</Button>}
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
              user={{name: video.uploaderName, id: video.uploaderId}}
              lastVideoId={last(videos) ? last(videos).id : 0}
            />
          )
        })}
      </SectionPanel>
    )
  }

  loadMoreVideos() {
    const {videos, getMoreVideos} = this.props
    const lastId = last(videos) ? last(videos).id : 0
    getMoreVideos(lastId)
  }
}
