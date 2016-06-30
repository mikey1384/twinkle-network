import React, {Component} from 'react';
import VideoThumb from 'components/VideoThumb';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as VideoActions from 'redux/actions/VideoActions';

@connect(
  null,
  dispatch => ({
    actions: bindActionCreators(VideoActions, dispatch)
  })
)
export default class AllVideosPanel extends Component {
  render (){
    const {loadMoreButton, actions, videos, title, isAdmin, onAddVideoClick} = this.props;
    const last = (array) => {
      return array[array.length - 1];
    }
    const loadMoreVideos = () => {
      const lastId = last(videos) ? last(videos).id : 0;
      actions.getMoreVideos(lastId);
    }
    return (
      <div className="panel panel-primary">
        <div className="panel-heading flexbox-container">
          <h3 className="panel-title pull-left">{title}</h3>
          {isAdmin &&
            <button
              className="btn btn-default pull-right"
              style={{
                marginLeft: 'auto'
              }}
              onClick={() => onAddVideoClick()}
            >+ Add Video</button>
          }
          <div className="clearfix"></div>
        </div>
        <div className="panel-body">
          {videos.map((video, index) => {
            const editable = this.props.userId == video.uploaderid;
            return (
              <VideoThumb
                to={`videos/${video.id}`}
                size="col-sm-3"
                key={video.id}
                arrayNumber={index}
                editable={editable}
                video={video}
                user={{name: video.uploadername, id: video.uploaderid}}
                lastVideoId={last(videos) ? last(videos).id : 0}
                editVideoTitle={actions.editVideoTitleAsync}
                deleteVideo={actions.deleteVideoAsync}
              />
            )
          })}
          {loadMoreButton &&
            <div className="text-center col-sm-12">
              <button className="btn btn-default" onClick={loadMoreVideos}>Load More</button>
            </div>
          }
        </div>
      </div>
    );
  }
}
