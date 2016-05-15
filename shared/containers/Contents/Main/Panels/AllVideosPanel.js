import React, { Component, PropTypes } from 'react';
import VideoThumb from 'components/VideoThumb';
import { bindActionCreators } from 'redux';

export default class AllVideosPanel extends Component {
  onAddVideoClick() {
    this.props.onAddVideoClick();
  }
  render (){
    const { loadMoreButton, getMoreVideos, videos, title, isAdmin } = this.props;
    const last = (array) => {
      return array[array.length - 1];
    };
    const loadMoreVideos = () => {
      const lastId = last(videos) ? last(videos).id : 0;
      getMoreVideos(lastId);
    }
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
          {
            isAdmin &&
            <button
              className="btn btn-default pull-right"
              style={{
                marginLeft: 'auto'
              }}
              onClick={this.onAddVideoClick.bind(this)}
            >+ Add Video</button>
          }
          <div className="clearfix"></div>
        </div>
        <div className="panel-body">
          {
            videos.map((video, index) => {
              const editable = this.props.userId == video.uploaderid ? true : false;
              return (
                <VideoThumb
                  to={`contents/videos/${video.id}`}
                  size="col-sm-3"
                  key={video.id}
                  arrayNumber={index}
                  editable={editable}
                  video={video}
                  lastVideoId={last(videos) ? last(videos).id : 0}
                  editVideoTitle={this.props.editVideoTitleAsync}
                  deleteVideo={this.props.deleteVideoAsync}
                  dispatch={this.props.dispatch}
                />
              )
            })
          }
          { loadMoreButton &&
            <div className="text-center col-sm-12">
              <button className="btn btn-default" onClick={loadMoreVideos}>Load More</button>
            </div>
          }
        </div>
      </div>
    );
  }
}
