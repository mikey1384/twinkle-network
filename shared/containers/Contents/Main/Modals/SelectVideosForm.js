import React, { Component } from 'react';
import VideoThumb from './ModalVideoThumb';

export default class SelectVideosForm extends Component {
  render() {
    const {
      videos,
      selectedVideos,
      loadMoreVideosButton,
      onSelect,
      onDeselect,
      loadMoreVideos
    } = this.props;

    const formVideos = videos.map((video, index) => {
      return (
        <VideoThumb
          key={index}
          video={video}
          selectable={true}
          selected={
            selectedVideos.indexOf(video.id) != -1 ? true : false
          }
          onSelect={
            (videoId => {
              let selected = selectedVideos;
              onSelect(selected, videoId);
            }).bind(this)
          }
          onDeselect={
            (videoId => {
              let selected = selectedVideos;
              const index = selected.indexOf(videoId);
              selected.splice(index, 1);
              onDeselect(selected);
            }).bind(this)
          }
        />
      )
    })

    return (
      <div className="row">
      {
        formVideos
      }
      {
        loadMoreVideosButton &&
        <div className="text-center">
          <button className="btn btn-default" onClick={loadMoreVideos}>Load More</button>
        </div>
      }
      </div>
    )
  }
}
