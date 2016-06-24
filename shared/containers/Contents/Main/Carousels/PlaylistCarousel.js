import React, {Component} from 'react';
import Carousel from 'nuka-carousel';
import VideoThumb from 'components/VideoThumb';
import SmallDropdownButton from 'components/SmallDropdownButton';
import EditTitleForm from 'components/EditTitleForm';
import EditPlaylistModal from '../Modals/EditPlaylistModal';
import ConfirmModal from 'components/Modals/ConfirmModal';

export default class PlaylistCarousel extends Component {
  constructor() {
    super()
    this.state = {
      onEdit: false,
      editPlaylistModalShown: false,
      deleteConfirmModalShown: false
    }
    this.onEditTitle = this.onEditTitle.bind(this)
    this.onChangeVideos = this.onChangeVideos.bind(this)
    this.onReorderVideos = this.onReorderVideos.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.onEditedTitleSubmit = this.onEditedTitleSubmit.bind(this)
    this.onEditTitleCancel = this.onEditTitleCancel.bind(this)
    this.onEditPlaylistHide = this.onEditPlaylistHide.bind(this)
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
  }

  render () {
    const {onEdit, editPlaylistModalShown, deleteConfirmModalShown} = this.state;
    const {title, uploader, editable, id} = this.props;
    const selectedVideos = this.props.playlist.map(thumb => {
      return thumb.videoid;
    })
    const menuProps = [
      {
        label: 'Edit Title',
        onClick: this.onEditTitle
      },
      {
        label: 'Change Videos',
        onClick: this.onChangeVideos
      },
      {
        label: 'Reorder Videos',
        onClick: this.onReorderVideos
      },
      {
        separator: true
      },
      {
        label: 'Remove Playlist',
        onClick: this.onDeleteClick
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
                title={title}
                onEditSubmit={this.onEditedTitleSubmit}
                onEditCancel={this.onEditTitleCancel}
                onClickOutSide={this.onEditTitleCancel}
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
          dragging={true}
        >
          {this.renderThumbs()}
        </Carousel>
        {editPlaylistModalShown &&
          <EditPlaylistModal
            show={true}
            selectedVideos={selectedVideos}
            playlistId={id}
            onHide={this.onEditPlaylistHide}
          />
        }
        {deleteConfirmModalShown &&
          <ConfirmModal
            show={true}
            title="Remove Playlist"
            onConfirm={this.onDeleteConfirm}
            onHide={() => this.setState({deleteConfirmModalShown: false})}
          />
        }
      </div>
    )
  }

  renderThumbs () {
    const {playlist} = this.props;
    return playlist.map((thumb, index) => {
      return (
        <VideoThumb
          to={`contents/videos/${thumb.videoid}`}
          key={index}
          video={{
            id: thumb.videoid,
            videocode: thumb.videocode,
            title: thumb.video_title,
            description: thumb.video_description,
            uploadername: thumb.video_uploader,
            numLikes: thumb.numLikes
          }}
        />
      )
    })
  }

  onEditTitle() {
    this.setState({onEdit: true})
  }

  onChangeVideos() {
    this.props.openChangePlaylistVideosModalAsync(this);
  }

  onReorderVideos() {
    const playlistVideos = this.props.playlist;
    this.props.openReorderPlaylistVideosModal(playlistVideos);
    this.setState({editPlaylistModalShown: true});
  }

  onEditedTitleSubmit(title) {
    const {editPlaylistTitleAsync, id, arrayNumber} = this.props;
    const playlistId = id;
    if (title && title !== this.props.title) {
      editPlaylistTitleAsync({title, playlistId}, arrayNumber, this);
    } else {
      this.setState({onEdit: false})
    }
  }

  onEditTitleCancel() {
    this.setState({onEdit: false})
  }

  onDeleteClick() {
    this.setState({deleteConfirmModalShown: true});
  }

  onDeleteConfirm() {
    const {deletePlaylistAsync, id} = this.props;
    deletePlaylistAsync(id, this);
  }

  onEditPlaylistHide() {
    this.props.resetPlaylistModalState();
    this.setState({editPlaylistModalShown: false});
  }
}
