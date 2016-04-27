import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import VideoThumb from 'components/VideoThumb';
import SmallDropdownButton from 'components/SmallDropdownButton';
import EditTitleForm from 'components/EditTitleForm';
import EditPlaylistModal from './Modals/EditPlaylistModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

export default class PlaylistCarousel extends Component {
  state = {
    onEdit: false,
    editPlaylistModalShown: false,
    deleteConfirmModalShown: false
  }

  renderThumbs () {
    const { playlist } = this.props;
    return playlist.map((thumb, index) => {
      return (
        <VideoThumb
          to={`contents/videos/${thumb.videoid}`}
          key={index}
          video={{
            videocode: thumb.videocode,
            title: thumb.video_title,
            uploadername: thumb.video_uploader
          }}
        />
      )
    })
  }

  onEditTitle() {
    this.setState({onEdit: true})
  }

  onChangeVideos() {
    this.props.openChangePlaylistVideosModal(this);
  }

  onReorderVideos() {
    const playlistVideos = this.props.playlist;
    this.props.openReorderPlaylistVideosModal(playlistVideos);
    this.setState({editPlaylistModalShown: true});
  }

  onEditedTitleSubmit(props) {
    const { title, editPlaylistTitle, id } = this.props;
    props['playlistId'] = id;
    if (props.title && props.title !== title) {
      editPlaylistTitle(props, this.props.arrayNumber, this);
    }
  }

  onEditTitleCancel() {
    this.setState({onEdit: false})
  }

  onDeleteClick() {
    this.setState({deleteConfirmModalShown: true});
  }

  onDeleteConfirm() {
    const { deletePlaylist, id } = this.props;
    deletePlaylist(id, this);
  }

  render () {
    const { onEdit, editPlaylistModalShown, deleteConfirmModalShown } = this.state;
    const { title, uploader, editable, id  } = this.props;
    const selectedVideos = this.props.playlist.map(thumb => {
      return thumb.videoid;
    })
    const initialTitleFormValues = {
      initialValues: {
        title: title
      }
    }
    const menuProps = [
      {
        label: 'Edit Title',
        onClick: this.onEditTitle.bind(this)
      },
      {
        label: 'Change Videos',
        onClick: this.onChangeVideos.bind(this)
      },
      {
        label: 'Reorder Videos',
        onClick: this.onReorderVideos.bind(this)
      },
      {
        separator: true
      },
      {
        label: 'Remove Playlist',
        onClick: this.onDeleteClick.bind(this)
      }
    ]
    return (
      <div className="container-fluid">
        <div className="row container-fluid">
          {onEdit ?
            <div
              className="input-group col-sm-6 pull-left"
              style={{
                paddingBottom: '0.3em'
              }}
            >
              <EditTitleForm
                {...initialTitleFormValues}
                onEditSubmit={ this.onEditedTitleSubmit.bind(this) }
                onEditCancel={ this.onEditTitleCancel.bind(this) }
              />
            </div>
            :
            <h4
              className="pull-left"
            >
              {title} <small>by {uploader}</small>
            </h4>
          }
          {editable &&
            <SmallDropdownButton
              menuProps={menuProps}
              rightMargin="1em"
            />
          }
        </div>
        <Carousel
          slidesToShow={5}
          slidesToScroll={5}
          cellSpacing={20}
          dragging={false}
        >
          { this.renderThumbs() }
        </Carousel>
        {editPlaylistModalShown &&
          <EditPlaylistModal
            show={true}
            selectedVideos={selectedVideos}
            playlistId={id}
            onHide={ this.onEditPlaylistHide.bind(this) }
          />
        }
        {deleteConfirmModalShown &&
          <ConfirmModal
            show={true}
            title="Remove Playlist"
            onConfirm={this.onDeleteConfirm.bind(this)}
            onHide={ () => this.setState({deleteConfirmModalShown: false})}
          />
        }
      </div>
    )
  }

  onEditPlaylistHide() {
    this.props.resetPlaylistModalState();
    this.setState({editPlaylistModalShown: false});
  }
}
