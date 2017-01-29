import React, {Component, PropTypes} from 'react'
import ExecutionEnvironment from 'exenv'
import Carousel from 'components/Carousel'
import VideoThumb from 'components/VideoThumb'
import SmallDropdownButton from 'components/SmallDropdownButton'
import EditTitleForm from 'components/EditTitleForm'
import EditPlaylistModal from '../Modals/EditPlaylistModal'
import ConfirmModal from 'components/Modals/ConfirmModal'
import {
  editPlaylistTitleAsync,
  openChangePlaylistVideosModalAsync,
  openReorderPlaylistVideosModal,
  deletePlaylistAsync,
  resetPlaylistModalState
} from 'redux/actions/PlaylistActions'
import {connect} from 'react-redux'

@connect(
  state => ({
    clickSafe: state.PlaylistReducer.clickSafe
  }),
  {
    editPlaylistTitleAsync,
    openChangePlaylistVideosModalAsync,
    openReorderPlaylistVideosModal,
    deletePlaylistAsync,
    resetPlaylistModalState
  }
)
export default class PlaylistCarousel extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    uploader: PropTypes.string.isRequired,
    playlist: PropTypes.array.isRequired,
    arrayIndex: PropTypes.number.isRequired,
    editable: PropTypes.bool,
    clickSafe: PropTypes.bool,
    openChangePlaylistVideosModalAsync: PropTypes.func,
    openReorderPlaylistVideosModal: PropTypes.func,
    editPlaylistTitleAsync: PropTypes.func,
    deletePlaylistAsync: PropTypes.func,
    resetPlaylistModalState: PropTypes.func
  }

  constructor() {
    super()
    let numSlides = 7
    if (ExecutionEnvironment.canUseDOM) {
      numSlides = document.documentElement.clientWidth < 768 ? 3 : 7
    }
    this.state = {
      onEdit: false,
      editPlaylistModalShown: false,
      deleteConfirmModalShown: false,
      numSlides
    }
    this.onEditTitle = this.onEditTitle.bind(this)
    this.onChangeVideos = this.onChangeVideos.bind(this)
    this.onReorderVideos = this.onReorderVideos.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.onEditedTitleSubmit = this.onEditedTitleSubmit.bind(this)
    this.onEditTitleCancel = this.onEditTitleCancel.bind(this)
    this.onEditPlaylistHide = this.onEditPlaylistHide.bind(this)
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    bindListeners.call(this)
    function bindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        addEvent(window, 'resize', this.onResize)
      }

      function addEvent(elem, type, eventHandle) {
        if (elem === null || typeof elem === 'undefined') {
          return
        }
        if (elem.addEventListener) {
          elem.addEventListener(type, eventHandle, false)
        } else if (elem.attachEvent) {
          elem.attachEvent('on' + type, eventHandle)
        } else {
          elem['on' + type] = eventHandle
        }
      }
    }
  }

  componentWillUnmount() {
    unbindListeners.call(this)
    function unbindListeners() {
      if (ExecutionEnvironment.canUseDOM) {
        removeEvent(window, 'resize', this.onResize)
      }

      function removeEvent(elem, type, eventHandle) {
        if (elem === null || typeof elem === 'undefined') {
          return
        }
        if (elem.removeEventListener) {
          elem.removeEventListener(type, eventHandle, false)
        } else if (elem.detachEvent) {
          elem.detachEvent('on' + type, eventHandle)
        } else {
          elem['on' + type] = null
        }
      };
    }
  }

  render() {
    const {onEdit, editPlaylistModalShown, deleteConfirmModalShown, numSlides} = this.state
    const {title, uploader, editable, id} = this.props
    const selectedVideos = this.props.playlist.map(thumb => {
      return thumb.videoId
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
              style={{
                position: 'absolute',
                right: '1em',
                marginRight: '1em',
                zIndex: '1'
              }}
              shape="button"
              icon="pencil"
              menuProps={menuProps}
            />
          }
        </div>
        <Carousel
          progressBar={false}
          slidesToShow={numSlides}
          slidesToScroll={numSlides}
          cellSpacing={20}
          dragging={true}
        >
          {this.renderThumbs()}
        </Carousel>
        {editPlaylistModalShown &&
          <EditPlaylistModal
            selectedVideos={selectedVideos}
            playlistId={id}
            onHide={this.onEditPlaylistHide}
          />
        }
        {deleteConfirmModalShown &&
          <ConfirmModal
            title="Remove Playlist"
            onConfirm={this.onDeleteConfirm}
            onHide={() => this.setState({deleteConfirmModalShown: false})}
          />
        }
      </div>
    )
  }

  renderThumbs() {
    const {playlist, clickSafe} = this.props
    return playlist.map((thumb, index) => {
      return (
        <VideoThumb
          to={`videos/${thumb.videoId}`}
          clickSafe={clickSafe}
          key={index}
          video={{
            id: thumb.videoId,
            videoCode: thumb.videoCode,
            title: thumb.video_title,
            description: thumb.video_description,
            uploaderName: thumb.video_uploader,
            numLikes: thumb.numLikes
          }}
          user={{name: thumb.video_uploader, id: thumb.video_uploader_id}}
        />
      )
    })
  }

  onEditTitle() {
    this.setState({onEdit: true})
  }

  onChangeVideos() {
    this.props.openChangePlaylistVideosModalAsync(this)
  }

  onReorderVideos() {
    const playlistVideos = this.props.playlist
    this.props.openReorderPlaylistVideosModal(playlistVideos)
    this.setState({editPlaylistModalShown: true})
  }

  onEditedTitleSubmit(title) {
    const {editPlaylistTitleAsync, id, arrayIndex} = this.props
    const playlistId = id
    if (title && title !== this.props.title) {
      editPlaylistTitleAsync({title, playlistId}, arrayIndex, this)
    } else {
      this.setState({onEdit: false})
    }
  }

  onEditTitleCancel() {
    this.setState({onEdit: false})
  }

  onDeleteClick() {
    this.setState({deleteConfirmModalShown: true})
  }

  onDeleteConfirm() {
    const {deletePlaylistAsync, id} = this.props
    deletePlaylistAsync(id, this)
  }

  onEditPlaylistHide() {
    this.props.resetPlaylistModalState()
    this.setState({editPlaylistModalShown: false})
  }

  onResize() {
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({numSlides: document.documentElement.clientWidth < 768 ? 3 : 7})
    }
  }
}
