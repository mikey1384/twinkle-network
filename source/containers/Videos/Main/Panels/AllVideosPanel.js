import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import VideoThumb from 'components/VideoThumb'
import { connect } from 'react-redux'
import { getMoreVideos } from 'redux/actions/VideoActions'
import SectionPanel from 'components/SectionPanel'
import Button from 'components/Button'
import { stringIsEmpty } from 'helpers/stringHelpers'
import request from 'axios'
import { URL } from 'constants/URL'

const last = array => {
  return array[array.length - 1]
}

class AllVideosPanel extends Component {
  static propTypes = {
    authLevel: PropTypes.number,
    canDelete: PropTypes.bool,
    canEdit: PropTypes.bool,
    getMoreVideos: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loadMoreButton: PropTypes.bool.isRequired,
    onAddVideoClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    videos: PropTypes.array.isRequired
  }

  timer = null

  state = {
    searchQuery: '',
    searchedVideos: [],
    isSearching: false
  }

  render() {
    const {
      loadMoreButton,
      videos: allVideos,
      title = 'All Videos',
      loaded,
      onAddVideoClick
    } = this.props
    const { searchQuery, searchedVideos, isSearching } = this.state
    const videos = searchQuery ? searchedVideos : allVideos
    return (
      <SectionPanel
        title={title}
        searchPlaceholder="Search videos"
        button={
          <Button
            snow
            style={{ marginLeft: 'auto' }}
            onClick={() => onAddVideoClick()}
          >
            + Add Video
          </Button>
        }
        emptyMessage="No Videos"
        isEmpty={videos.length === 0}
        loaded={loaded}
        loadMoreButtonShown={stringIsEmpty(searchQuery) && loadMoreButton}
        loadMore={this.loadMoreVideos}
        onSearch={this.onVideoSearch}
        searchQuery={searchQuery}
        isSearching={isSearching}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around'
          }}
        >
          {videos.map((video, index) => {
            return (
              <VideoThumb
                to={`videos/${video.id}`}
                style={{ width: '22%', height: '25%', marginBottom: '2rem' }}
                key={video.id}
                arrayIndex={index}
                editable={this.determineEditable(video)}
                deletable={this.determineDeletable(video)}
                video={video}
                user={{ username: video.uploaderName, id: video.uploaderId }}
                lastVideoId={last(videos) ? last(videos).id : 0}
              />
            )
          })}
        </div>
      </SectionPanel>
    )
  }

  determineDeletable = video => {
    const { authLevel, canDelete, userId } = this.props
    const userIsUploader = video.uploaderId === userId
    const userCanDeleteThis = canDelete && authLevel > video.uploaderAuthLevel
    return userIsUploader || userCanDeleteThis
  }

  determineEditable = video => {
    const { authLevel, canEdit, userId } = this.props
    const userIsUploader = video.uploaderId === userId
    const userCanEditThis = canEdit && authLevel > video.uploaderAuthLevel
    return userIsUploader || userCanEditThis
  }

  loadMoreVideos = () => {
    const { videos, getMoreVideos } = this.props
    const lastId = last(videos) ? last(videos).id : 0
    return getMoreVideos(lastId)
  }

  onVideoSearch = text => {
    clearTimeout(this.timer)
    this.setState({ searchQuery: text, isSearching: true })
    this.timer = setTimeout(() => this.searchVideo(text), 300)
  }

  searchVideo = async text => {
    if (stringIsEmpty(text) || text.length < 3) {
      return this.setState({ searchedVideos: [], isSearching: false })
    }
    try {
      const { data: searchedVideos } = await request.get(
        `${URL}/video/search?query=${text}`
      )
      this.setState({ searchedVideos, isSearching: false })
    } catch (error) {
      console.error(error.response || error)
    }
  }
}

export default connect(
  state => ({
    authLevel: state.UserReducer.authLevel,
    canDelete: state.UserReducer.canDelete,
    canEdit: state.UserReducer.canEdit,
    canStar: state.UserReducer.canStar,
    loaded: state.VideoReducer.loaded,
    loadMoreButton: state.VideoReducer.loadMoreButton,
    videos: state.VideoReducer.allVideoThumbs
  }),
  {
    getMoreVideos
  }
)(withRouter(AllVideosPanel))
