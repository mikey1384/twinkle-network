import React, {Component, PropTypes} from 'react';
import VideoThumb from 'components/VideoThumb';
import Button from 'components/Button';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getMoreVideos} from 'redux/actions/VideoActions';

const last = (array) => {
  return array[array.length - 1];
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
    loadMoreButton: PropTypes.bool
  }

  constructor() {
    super()
    this.loadMoreVideos = this.loadMoreVideos.bind(this)
  }

  render() {
    const {loadMoreButton, videos, title = 'All Videos', onAddVideoClick} = this.props;
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
          <Button
            className="btn btn-default pull-right"
            style={{marginLeft: 'auto'}}
            onClick={() => onAddVideoClick()}
          >+ Add Video</Button>
          <div className="clearfix"></div>
        </div>
        <div className="panel-body">
          {videos.map((video, index) => {
            const editable = this.props.userId === video.uploaderId;
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
          {loadMoreButton &&
            <div className="text-center col-sm-12">
              <Button className="btn btn-success" onClick={this.loadMoreVideos}>Load More</Button>
            </div>
          }
        </div>
      </div>
    );
  }

  loadMoreVideos() {
    const {videos, getMoreVideos} = this.props;
    const lastId = last(videos) ? last(videos).id : 0;
    getMoreVideos(lastId);
  }
}
