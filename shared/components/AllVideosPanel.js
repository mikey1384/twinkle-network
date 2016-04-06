import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { openAddVideoModal } from 'actions/VideoActions';
import VideoThumb from 'components/VideoThumb';
import LoadMoreButton from 'components/LoadMoreButton';

class AllVideosPanel extends Component {
  renderVideos (lastVideoId){
    const { videos, userId } = this.props;
    return videos.map(video => {
      const editable = userId == video.uploaderid ? true : false;
      return (
        <VideoThumb
          size="col-sm-3"
          key={video.id}
          arrayNumber={videos.indexOf(video)}
          editable={editable}
          video={video}
          lastVideoId={lastVideoId} />
      )
    })
  }

  render (){
    const { loadMoreButton, getMoreVideos, videos, key, title, isAdmin, dispatch } = this.props;
    const last = (array) => {
      return array[array.length - 1];
    };
    const lastId = last(videos) ? last(videos).id : 0;
    const loadMoreVideos = () => {
      getMoreVideos(lastId);
    }
    return (
      <div className="panel panel-primary" key={key}>
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
          {
            isAdmin &&
            <button
              className="btn btn-default pull-right"
              style={{
                marginLeft: 'auto'
              }}
              onClick={() => dispatch(openAddVideoModal())}
            >+ Add Video</button>
          }
          <div className="clearfix"></div>
        </div>
        <div className="panel-body">
          { this.renderVideos(lastId) }
          { loadMoreButton &&
            <div className="text-center">
              <button className="btn btn-default" onClick={loadMoreVideos}>Load More</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect()(AllVideosPanel);
